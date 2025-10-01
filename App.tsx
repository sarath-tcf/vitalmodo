import React from 'react';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  // The App now solely renders the ChatWidget, making it a self-contained
  // component perfect for embedding into other websites via an iframe.
  return (
    <ChatWidget />
  );
};

export default App;