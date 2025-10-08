import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2.5 animate-fade-in-up">
      <div className="px-4 py-3 rounded-2xl bg-[#F2F2F2] rounded-bl-none">
        <div className="flex items-center justify-center space-x-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;