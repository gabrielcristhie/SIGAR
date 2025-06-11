import React, { useEffect } from 'react';
import useAppStore from '../stores/useAppStore';

const Notification = () => {
  const { error, clearError } = useAppStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000); // Auto-fechar após 5 segundos

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            <span className="text-sm font-medium">Erro</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <p className="text-sm mt-1">{error}</p>
      </div>
    </div>
  );
};

export default Notification;
