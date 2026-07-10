const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2:3b';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 120000, // Increased to 2 minutes
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
          num_predict: 200 // Limit response length for speed
        }
      });

      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        console.error('Unexpected Ollama response:', response.data);
        return 'I apologize, but I am having trouble generating a response right now. Could you please rephrase your question?';
      }
    } catch (error) {
      console.error('Error generating response from Ollama:', error.message);
      if (error.response) {
        console.error('Ollama API error:', error.response.data);
      }
      // Return a fallback response instead of throwing
      return 'I understand you want to invest. To give you better guidance, could you tell me about your risk tolerance - are you comfortable with high risk for potentially higher returns, or do you prefer safer investments?';
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
      // Return a fallback response
      return 'I understand you want to invest for retirement. To give you better guidance, could you tell me about your risk tolerance - are you comfortable with high risk for potentially higher returns, or do you prefer safer investments?';
    }
  }
}

module.exports = new OllamaService();
