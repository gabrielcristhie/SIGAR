import React, { useState } from 'react';
import useAppStore from '../stores/useAppStore';
import CadastroAreaModal from './CadastroAreaModal';
import EditarAreaModal from './EditarAreaModal';
import RequestManagementModal from './RequestManagementModal';
import RemovalRequestByIdModal from './RemovalRequestByIdModal';
import RoadmapModal from './RoadmapModal';

const Sidebar = ({ isOpen, onDrawModeChange, isDrawMode = false }) => {
  const { toggleLoginModal, isAuthenticated, user, getSelectedArea } = useAppStore();
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isRemovalManagementOpen, setIsRemovalManagementOpen] = useState(false);
  const [isRemovalRequestOpen, setIsRemovalRequestOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isIncluirAreaExpanded, setIsIncluirAreaExpanded] = useState(false);

  const handleAuthenticatedAction = (actionTitle) => {
    if (isAuthenticated) {
      if (actionTitle === 'Incluir Área de Risco') {
        setIsIncluirAreaExpanded(!isIncluirAreaExpanded);
      } else if (actionTitle === 'Incluir via Formulário') {
        setIsCadastroModalOpen(true);
        setIsIncluirAreaExpanded(false);
      } else if (actionTitle === 'Incluir via Desenho') {
        if (onDrawModeChange) {
          onDrawModeChange(!isDrawMode);
        }
        setIsIncluirAreaExpanded(false);
      } else if (actionTitle === 'Alterar Área de Risco') {
        const selectedArea = getSelectedArea();
        if (selectedArea) {
          setIsEditarModalOpen(true);
        } else {
          alert('Selecione uma área no mapa primeiro para editá-la.');
        }
      } else if (actionTitle === 'Gerenciar Solicitações') {
        setIsRemovalManagementOpen(true);
      } else if (actionTitle === 'Planejar Vistorias') {
        setIsRoadmapModalOpen(true);
      } else if (actionTitle === 'Remover Área de Risco') {
        setIsRemovalRequestOpen(true);
      } else {
        alert(`Funcionalidade "${actionTitle}" será implementada em breve.`);
      }
    } else {
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
            <div className="mb-2">
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
                <i className={`fas fa-chevron-${isIncluirAreaExpanded ? 'up' : 'down'} ml-auto text-gray-400`}></i>
                {!isAuthenticated && <i className="fas fa-lock ml-auto text-gray-400"></i>}
              </button>
              
              {isIncluirAreaExpanded && isAuthenticated && (
                <div className="ml-4 mt-2 space-y-1">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAuthenticatedAction('Incluir via Formulário');
                    }}
                    className="flex items-center py-2 px-3 rounded-md hover:bg-gray-600 w-full text-left text-sm"
                    type="button"
                  >
                    <i className="fas fa-edit w-5 mr-2 text-blue-400"></i> 
                    📋 Via Formulário
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAuthenticatedAction('Incluir via Desenho');
                    }}
                    className={`flex items-center py-2 px-3 rounded-md hover:bg-gray-600 w-full text-left text-sm ${
                      isDrawMode ? 'bg-green-600' : ''
                    }`}
                    type="button"
                  >
                    <i className="fas fa-pencil-alt w-5 mr-2 text-green-400"></i> 
                    {isDrawMode ? '🔒 Sair do Desenho' : '✏️ Desenhar no Mapa'}
                  </button>
                </div>
              )}
            </div>
            
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
          
          {isAuthenticated && user?.role === 'admin' && user?.username !== 'demo' && (
            <div className="mt-8 border-t border-gray-700 pt-4">
              <h3 className="text-md font-semibold mb-2">🛡️ Área Administrativa</h3>
              <button
                onClick={() => handleAuthenticatedAction('Gerenciar Solicitações')}
                className="w-full text-left px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-md transition-colors mb-2"
              >
                <i className="fas fa-tasks mr-2"></i>
                Gerenciar Solicitações
              </button>
              <button
                onClick={() => handleAuthenticatedAction('Planejar Vistorias')}
                className="w-full text-left px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition-colors mb-2"
              >
                <i className="fas fa-route mr-2"></i>
                Vistorias
              </button>
            </div>
          )}

          {isAuthenticated && (user?.role === 'inspector') && (
            <div className="mt-8 border-t border-gray-700 pt-4">
              <h3 className="text-md font-semibold mb-2">🔍 Área de Vistoria</h3>
              <button
                onClick={() => handleAuthenticatedAction('Planejar Vistorias')}
                className="w-full text-left px-3 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-md transition-colors mb-2"
              >
                <i className="fas fa-map-marked-alt mr-2"></i>
                Vistorias
              </button>
            </div>
          )}

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
      
      <EditarAreaModal 
        isOpen={isEditarModalOpen} 
        onClose={() => setIsEditarModalOpen(false)}
        areaToEdit={getSelectedArea()}
      />
      
      <RequestManagementModal 
        isOpen={isRemovalManagementOpen} 
        onClose={() => setIsRemovalManagementOpen(false)}
      />
      
      <RemovalRequestByIdModal 
        isOpen={isRemovalRequestOpen} 
        onClose={() => setIsRemovalRequestOpen(false)}
      />
      
      <RoadmapModal 
        isOpen={isRoadmapModalOpen} 
        onClose={() => setIsRoadmapModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
