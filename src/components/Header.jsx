import React from 'react';
import useAppStore from '../stores/useAppStore';

const Header = ({ onToggleMenu }) => {
  const { isAuthenticated, user, logout, toggleLoginModal } = useAppStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 border-b-2 border-blue-200">
      <div className="flex items-center">
        <button 
          onClick={onToggleMenu}
          className="text-gray-700 hover:text-blue-600 focus:outline-none mr-4 lg:hidden"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-blue-700">SIGAR-GO</h1>
          <span className="text-sm text-gray-500">Observatório de Áreas de Risco</span>
        </div>
        {/* <h1 className="text-2xl font-bold text-blue-700">SIGAR-GO</h1>
        <span className="ml-2 text-sm text-gray-500">Observatório de Áreas de Risco</span> */}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-full max-w-md hidden sm:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por localidade" 
              className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              disabled
            />
            <span className="absolute top-0 right-0 mt-2 mr-3">
              <i className="fas fa-search text-gray-400"></i>
            </span>
          </div>
        </div>
        
        {/* Informações do usuário */}
        {isAuthenticated && user && (
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        )}
        
        {/* {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <button
            onClick={() => toggleLoginModal(true, 'Teste de Modal')}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
            title="Teste do Modal"
          >
            TEST
          </button>
        )} */}
      </div>
    </header>
  );
};

export default Header;
