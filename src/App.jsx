import React, { useEffect } from 'react';
import Layout from './components/Layout';
import MapComponent from './components/MapComponent';
import LoginModal from './components/LoginModal';
import LoadingOverlay from './components/LoadingOverlay';
import Notification from './components/Notification';
import DebugPanel from './components/DebugPanel';
import useAppStore from './stores/useAppStore';
import 'leaflet/dist/leaflet.css';

function App() {
  const { 
    isInfoPanelOpen, 
    toggleInfoPanel,
    getSelectedArea,
    initialize,
    // TODO: Debug states
    isLoginModalOpen,
    loginActionTitle
  } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // TODO: Debug do estado do modal (remover em produção)
  useEffect(() => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('🐛 Estado do modal:', { isLoginModalOpen, loginActionTitle });
    }
  }, [isLoginModalOpen, loginActionTitle]);

  return (
    <>
      <Layout
        selectedArea={getSelectedArea()}
        isInfoPanelOpen={isInfoPanelOpen}
        onInfoPanelClose={() => toggleInfoPanel(false)}
      >
        <MapComponent />
      </Layout>

      <LoginModal />
      <LoadingOverlay />
      <Notification />
      {/* <DebugPanel /> */}
    </>
  );
}

export default App;
