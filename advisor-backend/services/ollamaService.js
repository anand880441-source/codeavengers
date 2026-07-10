const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2:3b';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateResponse(messages, systemPrompt = '') {
    try {
      const prompt = this.buildPrompt(messages, systemPrompt);
      
      console.log('Sending request to Ollama...');
      const response = await this.client.post('/api/generate', {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 150
        }
      });

      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        console.error('Unexpected Ollama response:', response.data);
        return this.getFallbackResponse(messages);
      }
    } catch (error) {
      console.error('Error generating response from Ollama:', error.message);
      if (error.response) {
        console.error('Ollama API error:', error.response.data);
      }
      return this.getFallbackResponse(messages);
    }
  }

  buildPrompt(messages, systemPrompt) {
    let prompt = '';
    
    if (systemPrompt) {
      prompt = prompt + 'System: ' + systemPrompt + '\n\n';
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const role = msg.role === 'assistant' ? 'Assistant' : 'User';
      prompt = prompt + role + ': ' + msg.content + '\n';
    }

    prompt = prompt + 'Assistant: ';
    return prompt;
  }

  getFallbackResponse(messages) {
    // Get the last user message
    let userMessage = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessage = messages[i].content.toLowerCase();
        break;
      }
    }

    const hasHistory = messages.length > 1;

    // Check for specific keywords
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
        const amount = match[0];
        return 'Great! So you can invest Rs.' + amount + ' per month. What is your investment goal - retirement, education, or wealth creation?';
      }
      return 'How much are you planning to invest monthly? This helps me provide personalized recommendations.';
    }
    
    if (userMessage.includes('horizon') || userMessage.includes('year') || userMessage.includes('term')) {
      if (userMessage.includes('long') || userMessage.includes('10')) {
        return 'A long-term horizon (7+ years) is great for wealth creation. What is your risk tolerance?';
      }
      return 'What is your investment horizon? Short term (1-3 years), medium term (3-7 years), or long term (7+ years)?';
    }

    if (userMessage.includes('goal') || userMessage.includes('save') || userMessage.includes('wealth')) {
      return 'Great! Could you tell me about your risk tolerance? Are you comfortable with market fluctuations?';
    }

    if (!hasHistory) {
      return 'Hello! I am your AI Mutual Fund Advisor. To help you better, could you tell me about your investment goals? Are you saving for retirement, education, or wealth creation?';
    }

    return 'I understand. Could you tell me more about your investment preferences? For example, your risk tolerance or investment horizon?';
  }

  async checkHealth() {
    try {
      const response = await this.client.get('/api/tags');
      return { status: 'healthy', models: response.data.models };
    } catch (error) {
      console.error('Ollama health check failed:', error.message);
      return { status: 'unhealthy' };
    }
  }

  async getConversationResponse(conversationHistory, userMessage, userProfile = null) {
    let systemPrompt = 'You are an AI Mutual Fund Advisor. Your role is to:\n';
    systemPrompt = systemPrompt + '1. Have a natural conversation with the user about their investment goals\n';
    systemPrompt = systemPrompt + '2. Ask questions to understand their risk tolerance, investment horizon, and financial situation\n';
    systemPrompt = systemPrompt + '3. Be helpful, friendly, and educational\n';
    systemPrompt = systemPrompt + '4. Never give specific investment advice - always say this is educational\n';
    systemPrompt = systemPrompt + '5. If the user asks for specific fund recommendations, ask them to complete the conversation first\n\n';
    systemPrompt = systemPrompt + 'Current user profile (if available):\n';
    systemPrompt = systemPrompt + (userProfile ? JSON.stringify(userProfile, null, 2) : 'Not yet collected');
    systemPrompt = systemPrompt + '\n\nImportant rules:\n';
    systemPrompt = systemPrompt + '- If the user has not shared their risk tolerance, ask about it\n';
    systemPrompt = systemPrompt + '- If the user has not shared their investment horizon, ask about it\n';
    systemPrompt = systemPrompt + '- If the user has not shared their monthly investment amount, ask about it\n';
    systemPrompt = systemPrompt + '- Keep responses concise and conversational\n';
    systemPrompt = systemPrompt + '- Ask one question at a time';

    const messages = [];
    for (let i = 0; i < conversationHistory.length; i++) {
      messages.push(conversationHistory[i]);
    }
    messages.push({ role: 'user', content: userMessage });

    try {
      const response = await this.generateResponse(messages, systemPrompt);
      return response;
    } catch (error) {
      console.error('Error in getConversationResponse:', error);
      return this.getFallbackResponse(messages);
    }
  }
}

module.exports = new OllamaService();
