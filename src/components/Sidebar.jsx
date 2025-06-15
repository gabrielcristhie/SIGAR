import React, { useState } from 'react';
import useAppStore from '../stores/useAppStore';
import CadastroAreaModal from './CadastroAreaModal';

const Sidebar = ({ isOpen }) => {
  const { toggleLoginModal, isAuthenticated, user } = useAppStore();
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);

  const handleLoginModalOpen = (actionTitle) => {
    toggleLoginModal(true, actionTitle);
  };

  const handleAuthenticatedAction = (actionTitle) => {
    console.log('🔘 Botão clicado:', actionTitle, 'Autenticado:', isAuthenticated);
    if (isAuthenticated) {
      if (actionTitle === 'Incluir Área de Risco') {
        setIsCadastroModalOpen(true);
      } else {
        alert(`Funcionalidade "${actionTitle}" será implementada em breve.`);
      }
    } else {
      console.log('🔐 Abrindo modal de login para:', actionTitle);
      toggleLoginModal(true, actionTitle);
    }
  };

  return (
    <aside className={`sidebar-fixed bg-gray-800 text-white w-64 flex-shrink-0 p-4 space-y-2 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-lg overflow-y-auto`}>
      <div className="h-full flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">
            {isAuthenticated ? 'Gerenciamento' : 'Ações (Login necessário)'}
          </h2>
          
          {isAuthenticated && user && (
            <div className="mb-4 p-3 bg-green-800 rounded-lg">
              <p className="text-sm text-green-100">
                <i className="fas fa-check-circle mr-2"></i>
                Logado como: {user.name}
              </p>
            </div>
          )}
          
          <nav>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAuthenticatedAction('Incluir Área de Risco');
              }}
              className="menu-item flex items-center py-2.5 px-4 rounded-lg hover:bg-gray-700 w-full text-left"
              type="button"
            >
              <i className="fas fa-plus-circle w-6 mr-2"></i> 
              Incluir Área de Risco
              {!isAuthenticated && <i className="fas fa-lock ml-auto text-gray-400"></i>}
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAuthenticatedAction('Alterar Área de Risco');
              }}
              className="menu-item flex items-center py-2.5 px-4 rounded-lg hover:bg-gray-700 w-full text-left"
              type="button"
            >
              <i className="fas fa-edit w-6 mr-2"></i> 
              Alterar Área de Risco
              {!isAuthenticated && <i className="fas fa-lock ml-auto text-gray-400"></i>}
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAuthenticatedAction('Remover Área de Risco');
              }}
              className="menu-item flex items-center py-2.5 px-4 rounded-lg hover:bg-gray-700 w-full text-left"
              type="button"
            >
              <i className="fas fa-trash-alt w-6 mr-2"></i> 
              Remover Área de Risco
              {!isAuthenticated && <i className="fas fa-lock ml-auto text-gray-400"></i>}
            </button>
          </nav>
          <div className="mt-8 border-t border-gray-700 pt-4">
            <h3 className="text-md font-semibold mb-2">Legenda de Risco</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full mr-2 border border-red-700" style={{backgroundColor: 'rgba(255,0,0,0.6)'}}></span> 
                Alto Risco
              </li>
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full mr-2 border border-orange-700" style={{backgroundColor: 'rgba(255,165,0,0.6)'}}></span> 
                Médio Risco
              </li>
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full mr-2 border border-yellow-600" style={{backgroundColor: 'rgba(255,255,0,0.6)'}}></span> 
                Baixo Risco
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex-shrink-0 text-xs text-gray-400 pt-4 border-t border-gray-700 mt-4">
          <p>&copy; 2025 Defesa Civil de Goiás</p>
          <p>Universidade Federal de Goiás</p>
        </div>
      </div>
      
      <CadastroAreaModal 
        isOpen={isCadastroModalOpen} 
        onClose={() => setIsCadastroModalOpen(false)} 
      />
    </aside>
  );
};

export default Sidebar;
