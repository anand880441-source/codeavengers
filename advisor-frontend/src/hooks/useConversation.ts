import { useState, useCallback } from 'react';
import { sendMessage, createConversation } from '../services/api';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const startConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const conv = await createConversation();
      setConversationId(conv._id);
      return conv._id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessageToConversation = useCallback(async (message: string) => {
    if (!conversationId) {
      const newId = await startConversation();
      if (!newId) {
        setError('No conversation available');
        return;
      }
      setConversationId(newId);
      // Retry sending with new ID
      return sendMessageToConversation(message);
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await sendMessage(conversationId, message);
      setMessages(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: response.message }
      ]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, startConversation]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setConversationId(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    startConversation,
    sendMessage: sendMessageToConversation,
    clearConversation,
  };
}
