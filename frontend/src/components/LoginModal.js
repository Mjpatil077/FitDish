import React from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="text-2xl" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-display font-bold text-primary-800 mb-3">
            Login to Continue
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Login to watch this video and personalize your FitDish journey. 
            Get access to courses, track your progress, and unlock personalized recommendations.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/login"
            onClick={onClose}
            className="btn btn-primary w-full text-center py-3 text-lg font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={onClose}
            className="btn btn-outline w-full text-center py-3 text-lg font-semibold border-2"
          >
            Create Account
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to FitDish? Sign up is free and takes less than a minute.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

