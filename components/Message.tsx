
import React from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
          <BotIcon />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-xl px-4 py-3 rounded-2xl text-white ${
          isUser
            ? 'bg-blue-600 rounded-br-none'
            : 'bg-slate-700 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default Message;
