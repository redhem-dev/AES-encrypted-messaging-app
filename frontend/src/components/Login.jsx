import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../../api/backendBaseURL';

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const response = await baseURL.get('/protected');
        if (response.status === 200) {
          // User is authenticated, redirect to chat
          navigate('/chat');
        }
      } catch (error) {
        // User is not authenticated, show login page
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h1>
        <p className="text-gray-600 mb-8">Sign in to start messaging securely</p>
        <button 
          className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-md bg-white hover:border-gray-500 text-gray-700 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleGoogleLogin}
        >
            
          <img 
            src="https://tse2.mm.bing.net/th?id=OIP.S3ZsU5iH6e3Z2K7lXlES7AHaFj&pid=Api" 
            alt="Google logo" 
            className="h-15 w-20 mr-3"
          />
          
        </button>
      </div>
    </div>
  );
};

export default Login;