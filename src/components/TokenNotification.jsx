import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const TokenNotification = ({ show, tokens, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return createPortal(
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🪙</div>
          <div className="flex-1">
            <div className="font-bold text-lg">+{tokens} SIGAR Coins</div>
            <div className="text-sm text-yellow-100">{message}</div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-yellow-200 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TokenNotification;
