import React, { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <>
            <ChatWindow isOpen={isOpen} onClose={toggleChat} />
            <ChatBubble isOpen={isOpen} onClick={toggleChat} />
        </>
    );
};

export default ChatWidget;
