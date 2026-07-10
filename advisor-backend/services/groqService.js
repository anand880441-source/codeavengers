const OpenAI = require('openai');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    
    if (!this.apiKey) {
      console.warn('⚠️ GROQ_API_KEY not set. Using fallback responses.');
    }
    
    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
      timeout: 30000,
    });
  }

  async generateResponse(messages, systemPrompt = '') {
    if (!this.apiKey) {
      return this.getFallbackResponse(messages);
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: systemPrompt || 'You are a helpful AI Mutual Fund Advisor. Keep responses concise and conversational.' 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      });

      return completion.choices[0]?.message?.content || this.getFallbackResponse(messages);
    } catch (error) {
      console.error('Groq API error:', error.message);
      if (error.status === 429) {
        return 'The AI service is currently busy. Please wait a moment and try again.';
      }
      return this.getFallbackResponse(messages);
    }
  }

  getFallbackResponse(messages) {
    let userMessage = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessage = messages[i].content.toLowerCase();
        break;
      }
    }

    const hasHistory = messages.length > 1;

    if (userMessage.includes('retirement') || userMessage.includes('retire')) {
      return 'Retirement planning is a great goal! How many years do you have until retirement? This will help me suggest appropriate investment strategies.';
    }
    
    if (userMessage.includes('risk') || userMessage.includes('safe') || userMessage.includes('volatile')) {
      if (userMessage.includes('high') || userMessage.includes('aggressive')) {
        return 'I understand you are comfortable with higher risk. Do you have a specific investment horizon in mind?';
      }
      return 'I understand you prefer safer investments. What is your investment horizon?';
    }
    
    if (userMessage.includes('month') || userMessage.includes('invest')) {
      const match = userMessage.match(/\d+/);
      if (match) {
        return 'Great! So you can invest ₹' + match[0] + ' per month. What is your investment goal - retirement, education, or wealth creation?';
      }
      return 'How much are you planning to invest monthly?';
    }
    
    if (userMessage.includes('horizon') || userMessage.includes('year') || userMessage.includes('term')) {
      if (userMessage.includes('long') || userMessage.includes('10')) {
        return 'A long-term horizon (7+ years) is great for wealth creation. What is your risk tolerance?';
      }
      return 'What is your investment horizon? Short term (1-3 years), medium term (3-7 years), or long term (7+ years)?';
    }

    if (!hasHistory) {
      return 'Hello! I am your AI Mutual Fund Advisor. Could you tell me about your investment goals? Are you saving for retirement, education, or wealth creation?';
    }

    return 'Could you tell me more about your investment preferences? For example, your risk tolerance or investment horizon?';
  }

  async getConversationResponse(conversationHistory, userMessage, userProfile = null) {
    let systemPrompt = 'You are an AI Mutual Fund Advisor. Your role is to:\n';
    systemPrompt += '1. Have a natural conversation with the user about their investment goals\n';
    systemPrompt += '2. Ask questions to understand their risk tolerance, investment horizon, and financial situation\n';
    systemPrompt += '3. Be helpful, friendly, and educational\n';
    systemPrompt += '4. Never give specific investment advice - always say this is educational\n';
    systemPrompt += '5. If the user asks for specific fund recommendations, ask them to complete the conversation first\n\n';
    systemPrompt += 'Current user profile (if available):\n';
    systemPrompt += userProfile ? JSON.stringify(userProfile, null, 2) : 'Not yet collected';
    systemPrompt += '\n\nImportant rules:\n';
    systemPrompt += '- If the user has not shared their risk tolerance, ask about it\n';
    systemPrompt += '- If the user has not shared their investment horizon, ask about it\n';
    systemPrompt += '- If the user has not shared their monthly investment amount, ask about it\n';
    systemPrompt += '- Keep responses concise and conversational\n';
    systemPrompt += '- Ask one question at a time';

    const messages = [...conversationHistory, { role: 'user', content: userMessage }];

    try {
      return await this.generateResponse(messages, systemPrompt);
    } catch (error) {
      console.error('Error in getConversationResponse:', error);
      return this.getFallbackResponse(messages);
    }
  }

  async checkHealth() {
    try {
      await this.client.models.list();
      return { status: 'healthy', provider: 'groq' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new GroqService();
