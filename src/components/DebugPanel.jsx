import React from 'react';
import useAppStore from '../stores/useAppStore';

const DebugPanel = () => {
  const { isLoginModalOpen, loginActionTitle, isAuthenticated } = useAppStore();

  if (import.meta.env.VITE_DEBUG_MODE !== 'true') return null;

  return (
    <div className="fixed top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-[9998] font-mono">
      <div>Modal: {isLoginModalOpen ? '✅ ABERTO' : '❌ FECHADO'}</div>
      <div>Título: {loginActionTitle || 'N/A'}</div>
      <div>Auth: {isAuthenticated ? '🔓 SIM' : '🔒 NÃO'}</div>
    </div>
  );
};

export default DebugPanel;
