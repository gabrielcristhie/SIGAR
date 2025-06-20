import React, { useEffect } from 'react';
import Layout from './components/Layout';
import MapComponent from './components/MapComponent';
import LoginModal from './components/LoginModal';
import LoadingOverlay from './components/LoadingOverlay';
import Notification from './components/Notification';
import useAppStore from './stores/useAppStore';
import 'leaflet/dist/leaflet.css';

function App() {
  const { 
    isInfoPanelOpen, 
    toggleInfoPanel,
    getSelectedArea,
    initialize
  } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
    </>
  );
}

export default App;
