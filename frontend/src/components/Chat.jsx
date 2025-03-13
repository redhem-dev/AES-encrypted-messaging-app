import React, { useEffect, useState } from 'react';
import baseURL from '../../api/backendBaseURL';

const ChatComponent = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [showEncryptPopup, setShowEncryptPopup] = useState(false);
  const [showDecryptPopup, setShowDecryptPopup] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');

  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
        try {
            const conversations = await baseURL.get('/chats', {
                method: 'GET',
                withCredentials: true
            })

            console.log(conversations);
            setChatList(conversations.data);
        } catch (error) {
            console.log(error);
        }
    }
    getConversations();
  }, []);
  

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setShowEncryptPopup(true);
  };

  const handleFinalizeSend = () => {
    if (!encryptionKey.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      encrypted: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedChat]: [...(prevMessages[selectedChat] || []), newMessage]
    }));
    
    setMessageInput('');
    setEncryptionKey('');
    setShowEncryptPopup(false);
  };

  const handleDecrypt = () => {
    setShowDecryptPopup(true);
  };

  const handleFinalizeDecrypt = () => {
    if (!decryptionKey.trim()) return;
    
    setMessages(prevMessages => {
      const currentChatMessages = prevMessages[selectedChat] || [];
      const updatedMessages = currentChatMessages.map(msg => ({
        ...msg,
        decrypted: true,
      }));
      
      return {
        ...prevMessages,
        [selectedChat]: updatedMessages
      };
    });
    
    setDecryptionKey('');
    setShowDecryptPopup(false);
  };


  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await baseURL.get('/logout');
      window.location.href = 'http://localhost:5173/'
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left side - Chat selection */}
      <div className="w-1/3 bg-white border-r border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-indigo-700 text-white p-4 shadow-md">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {chatList.map(chat => (
            <div 
              key={chat.conversation} 
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-indigo-50 transition-colors duration-150
                ${selectedChat === chat.conversation ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
              onClick={() => handleSelectChat(chat.conversation)}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-medium mr-3">
                  {chat.conversation.charAt(0)}
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800">{chat.conversation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-indigo-700 text-white p-4 shadow-md">
            <button 
              className="text-xl font-bold w-full text-left flex items-center cursor-pointer hover:text-indigo-200 transition-colors"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </>
              )}
            </button>
        </div>          
        
      </div>
      
      {/* Right side - Messages */}
      <div className="w-2/3 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            <div className="bg-white p-4 shadow-sm border-b border-gray-200">
              <h3 className="font-medium text-lg text-gray-800">
                {chatList.find(chat => chat.name === selectedChat)?.name}
              </h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              {(messages[selectedChat] || []).length > 0 ? (
                <div className="flex flex-col space-y-3">
                  {(messages[selectedChat] || []).map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-xl p-3 ${
                        message.sender === 'me' 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 rounded-bl-none'
                      }`}>
                        <div className="text-sm break-words">
                          {message.decrypted ? message.text : '🔒 Encrypted message'}
                        </div>
                        <div className={`text-xs mt-1 ${message.sender === 'me' ? 'text-indigo-100' : 'text-gray-500'}`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">Start the conversation by sending a message</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors duration-150 flex items-center"
                  onClick={handleSendMessage}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Send
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors duration-150 flex items-center"
                  onClick={handleDecrypt}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                  </svg>
                  Decrypt
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center px-4 py-8 max-w-md">
              <div className="bg-indigo-100 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to AES Encrypted Messaging</h3>
              <p className="text-gray-600 mb-6">Select a conversation from the sidebar to start messaging securely.</p>
              <div className="text-sm text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                All messages are encrypted for your security
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Encryption popup */}
      {showEncryptPopup && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Encryption Key</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter a key to encrypt your message. Remember to share this key with the recipient securely.
            </p>
            <input
              type="password"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              placeholder="Encryption key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowEncryptPopup(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalizeSend}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              >
                Encrypt & Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Decryption popup */}
      {showDecryptPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Decryption Key</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the key that was used to encrypt these messages.
            </p>
            <input
              type="password"
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
              placeholder="Decryption key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowDecryptPopup(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalizeDecrypt}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Decrypt Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
