import React from 'react';
import useAppStore from '../stores/useAppStore';

const LoadingOverlay = () => {
  const { loading } = useAppStore();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-700 font-medium">Carregando...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
