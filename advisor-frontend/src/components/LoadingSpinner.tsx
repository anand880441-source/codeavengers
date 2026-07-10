import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-1">
        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
