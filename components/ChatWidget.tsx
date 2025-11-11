import React, { useState, useEffect, useCallback } from 'react';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const handleMessage = useCallback((event: MessageEvent) => {
        // For enhanced security, it's recommended to check the origin of the message
        // to ensure it's coming from your trusted website.
        // Example: if (event.origin !== 'https://your-trusted-domain.com') return;

        if (event.data === 'open-chat-widget') {
            setIsOpen(true);
        } else if (event.data === 'close-chat-widget') {
            setIsOpen(false);
        } else if (event.data === 'toggle-chat-widget') {
            setIsOpen(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [handleMessage]);

    return (
        <>
            <ChatWindow isOpen={isOpen} onClose={toggleChat} />
            <ChatBubble isOpen={isOpen} onClick={toggleChat} />
        </>
    );
};

export default ChatWidget;
