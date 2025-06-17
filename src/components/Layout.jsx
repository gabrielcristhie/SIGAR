import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import InfoPanel from './InfoPanel';
import TokenModal from './TokenModal';
import TokenNotification from './TokenNotification';
import useAppStore from '../stores/useAppStore';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isTokenModalOpen, toggleTokenModal, tokenNotification, hideTokenNotification } = useAppStore();

  const handleToggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <Header onToggleMenu={handleToggleMenu} />
      
      <div className="flex h-full" style={{ paddingTop: '80px' }}>
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-grow relative overflow-hidden">
          {children}
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
