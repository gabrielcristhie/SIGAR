import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const LoginModal = () => {
  const { isLoginModalOpen, loginActionTitle, toggleLoginModal, login, loading, error, clearError } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isLoginModalOpen) {
        handleClose();
      }
    };

    if (isLoginModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLoginModalOpen]);

  const handleClose = () => {
    toggleLoginModal(false);
    setUsername('');
    setPassword('');
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!username.trim() || !password.trim()) {
      setLocalError('Por favor, preencha todos os campos.');
      return;
    }

    const result = await login({ username, password });
    
    if (!result.success) {
      setLocalError(result.error || 'Erro ao fazer login');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  if (!isLoginModalOpen) return null;

  const modalContent = (
    <div className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
        style={{ zIndex: 9998 }}
      />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0" style={{ zIndex: 9999, position: 'relative' }}>
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-8 pt-8 pb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Login: {loginActionTitle}
              </h2>
              <button 
                onClick={handleClose} 
                className="text-gray-500 hover:text-gray-800 text-xl p-1"
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          <p className="text-gray-600 mb-6">
            Para {loginActionTitle?.toLowerCase()}, por favor, insira suas credenciais.
          </p>
          
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm">{localError || error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuário (CPF ou Matrícula)
              </label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                required
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition duration-150 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Acesso restrito a agentes da Defesa Civil.
          </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LoginModal;
