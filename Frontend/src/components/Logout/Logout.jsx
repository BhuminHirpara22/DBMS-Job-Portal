import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../../tokenUtils';
import { FaSignOutAlt } from 'react-icons/fa';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      // Remove the token
      removeToken();
      
      // Redirect to login page
      navigate('/');
    };

    // Execute logout immediately
    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <FaSignOutAlt className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Logging Out</h2>
          <p className="text-gray-400">You have been successfully logged out.</p>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
