import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import InfoPanel from './InfoPanel';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    </div>
  );
};

export default Layout;
