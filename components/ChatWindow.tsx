import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, MessageAuthor } from "../types";
import { getChat } from "../services/geminiService";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { SendIcon } from "./icons/SendIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { BotIcon } from "./icons/BotIcon";
import { Chat } from "@google/genai";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const initializeConversation = useCallback(() => {
    if (messages.length > 0) return;

    setIsTyping(true);
    setError(null);

    const initialBotMessage: ChatMessage = {
      author: MessageAuthor.BOT,
      text: "I am Dr.Vital, AI Powered Symptom Checker. I'm here to help you with health symptoms, mental challenges.",
    };

    // a small delay to simulate "thinking" before showing the first message
    setTimeout(() => {
      setMessages([initialBotMessage]);
      setIsTyping(false);
    }, 1000);

    // Initialize the chat instance without sending a message
    if (!chatRef.current) {
      try {
        chatRef.current = getChat();
      } catch (e) {
        console.error(e);
        setError(
          "Failed to initialize chat service. Please check your API key."
        );
        setIsTyping(false);
      }
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

    const userMessage: ChatMessage = {
      author: MessageAuthor.USER,
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const stream = await chatRef.current.sendMessageStream({
        message: input,
      });

      let botResponse = "";
      setMessages((prev) => [...prev, { author: MessageAuthor.BOT, text: "" }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = botResponse;
          return newMessages;
        });
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while getting a response. Please try again.");
      setMessages((prev) => prev.slice(0, -1)); // Remove the bot's empty message placeholder
    } finally {
      setIsTyping(false);
    }
  };

  const visibilityClasses = isOpen
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4 pointer-events-none";

  return (
    <div
      className={`fixed bottom-28 right-5 sm:right-8 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[70vh] max-h-[700px] z-40 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out pointer-events-auto ${visibilityClasses}`}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center shrink-0">
            <BotIcon sizeClass="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-black">VitalModo</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-1 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1363DF]"
        >
          <CloseIcon sizeClass="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          {error && (
            <div className="text-red-500 text-center p-2 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms..."
            className="flex-1 w-full px-5 py-3 text-base text-gray-800 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1363DF] transition duration-300"
            disabled={isTyping}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-[#1363DF] text-white rounded-full p-3 hover:bg-[#0E4FB6] disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#1363DF] focus:ring-offset-2 focus:ring-offset-white"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
        <p className="text-center text-gray-400 text-xs mt-3 px-2">
          Disclaimer: This AI is for informational purposes and not a substitute
          for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
