import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import InfoPanel from './InfoPanel';
import TokenModal from './TokenModal';
import TokenNotification from './TokenNotification';
import useAppStore from '../stores/useAppStore';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const { isTokenModalOpen, toggleTokenModal, tokenNotification, hideTokenNotification } = useAppStore();

  const handleToggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDrawModeChange = (drawMode) => {
    setIsDrawMode(drawMode);
  };

  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <Header onToggleMenu={handleToggleMenu} />
      
      {isDrawMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <i className="fas fa-pencil-alt"></i>
            <span className="font-medium">Modo Desenho Ativo</span>
            <span className="text-green-200">•</span>
            <span className="text-sm">Use as ferramentas no mapa para desenhar</span>
            <button 
              onClick={() => setIsDrawMode(false)}
              className="ml-4 text-green-200 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex h-full" style={{ paddingTop: '80px' }}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onDrawModeChange={handleDrawModeChange}
          isDrawMode={isDrawMode}
        />
        
        <main className="flex-grow relative overflow-hidden">
          {React.cloneElement(children, { 
            isDrawMode, 
            onDrawModeChange: handleDrawModeChange 
          })}
        </main>
        
        <InfoPanel />
      </div>

      <TokenModal 
        isOpen={isTokenModalOpen} 
        onClose={() => toggleTokenModal(false)} 
      />

      <TokenNotification
        show={tokenNotification.show}
        tokens={tokenNotification.tokens}
        message={tokenNotification.message}
        onClose={hideTokenNotification}
      />
    </div>
  );
};

export default Layout;
