import React from 'react';
import { ChatIcon } from './icons/ChatIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ChatBubbleProps {
    isOpen: boolean;
    onClick: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 w-16 h-16 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-transform duration-300 ease-in-out transform hover:scale-110 pointer-events-auto"
            aria-label={isOpen ? "Close chat" : "Open chat"}
        >
            <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'transform rotate-90 scale-0 opacity-0' : 'transform rotate-0 scale-100 opacity-100'}`}>
                <ChatIcon />
            </div>
            <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'transform rotate-0 scale-100 opacity-100' : 'transform -rotate-90 scale-0 opacity-0'}`}>
                <CloseIcon />
            </div>
        </button>
    );
};

export default ChatBubble;