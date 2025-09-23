// utils/hooks/useChat.ts
'use client';

import { useState, useCallback } from 'react'; // 👈 Import useCallback

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    addMessage({ role: 'user', content });
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      addMessage({
        role: 'assistant',
        content:
          'That’s a great question! A 5% tariff increase could impact import costs and consumer prices. Would you like a detailed analysis?',
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]); // 👈 Depend on addMessage (also memoized)

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []); // 👈 Now this function is stable across renders

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    clearChat,
  };
};