import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { getChat } from '../services/geminiService';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { SendIcon } from './icons/SendIcon';
import Disclaimer from './Disclaimer';
import { CloseIcon } from './icons/CloseIcon';
import { Chat } from '@google/genai';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const initializeConversation = useCallback(async () => {
    // Ensure chat is initialized and don't re-initialize if messages exist
    if (!chatRef.current) {
        chatRef.current = getChat();
    }
    if (messages.length > 0) return;
    
    setIsTyping(true);
    setError(null);
    try {
      const initialMessage = "Hello! I'm an AI Symptom Checker. Please describe your symptoms. Remember, I am not a medical professional, and you should always consult a doctor for a real diagnosis.";
      
      const stream = await chatRef.current.sendMessageStream({ message: initialMessage });

      let botResponse = '';
      setMessages([{ author: MessageAuthor.BOT, text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages([{ author: MessageAuthor.BOT, text: botResponse }]);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to initialize conversation. Please check your API key and refresh the page.');
    } finally {
      setIsTyping(false);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isOpen) {
        initializeConversation();
    }
  }, [isOpen, initializeConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !chatRef.current) return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });
      
      let botResponse = '';
      setMessages(prev => [...prev, { author: MessageAuthor.BOT, text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = botResponse;
            return newMessages;
        });
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while getting a response. Please try again.');
      setMessages(prev => prev.slice(0, -1)); // Remove the bot's empty message placeholder
    } finally {
      setIsTyping(false);
    }
  };
  
  const visibilityClasses = isOpen 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-4 pointer-events-none';

  return (
    <div className={`fixed bottom-24 right-5 sm:right-8 w-[calc(100vw-2.5rem)] sm:w-96 h-[70vh] max-h-[600px] z-40 flex flex-col bg-slate-800 rounded-lg shadow-2xl border border-slate-700 transition-all duration-300 ease-in-out pointer-events-auto ${visibilityClasses}`}>
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-slate-700 flex-shrink-0">
            <h2 className="font-bold text-lg text-slate-200">AI Symptom Checker</h2>
            <button onClick={onClose} aria-label="Close chat" className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <CloseIcon sizeClass="w-5 h-5" />
            </button>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
            <Disclaimer />
            <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
                {messages.map((msg, index) => (
                <Message key={index} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                {error && <div className="text-red-400 text-center p-2 bg-red-500/10 rounded-md">{error}</div>}
                <div ref={messagesEndRef} />
            </div>
        </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms..."
            className="flex-1 w-full px-5 py-3 text-sm text-slate-200 bg-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            disabled={isTyping}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;