import { useState } from 'react'
import './App.css'
import ChatComponent from './components/Chat';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-screen overflow-hidden">
        <ChatComponent/>
      </div>
    </div>
  );
};

export default App
