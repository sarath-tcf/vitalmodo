import React from 'react';
import { ChatMessage, MessageAuthor } from '../types';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : ''} animate-fade-in-up`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-[#1363DF] text-white rounded-br-none'
            : 'bg-[#F2F2F2] text-black rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap text-base">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;