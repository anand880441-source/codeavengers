import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createConversation = async () => {
  try {
    const response = await apiClient.post('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const getConversation = async (conversationId) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

export const sendMessage = async (conversationId, messageContent) => {
  try {
    const response = await apiClient.post(`/chat/${conversationId}/messages`, {
      content: messageContent
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getNextQuestion = async (conversationId) => {
  try {
    const response = await apiClient.get(`/chat/${conversationId}/next-question`);
    return response.data;
  } catch (error) {
    console.error('Error getting next question:', error);
    throw error;
  }
};

export const checkComplete = async (conversationId) => {
  try {
    const response = await apiClient.get(`/chat/${conversationId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error checking completion:', error);
    throw error;
  }
};

export const generateReport = async (conversationId) => {
  try {
    const response = await apiClient.post('/reports/generate', {
      conversationId: conversationId
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const getReport = async (reportId) => {
  try {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting report:', error);
    throw error;
  }
};

export default apiClient;
