import React, { useEffect } from 'react';
import Layout from './components/Layout';
import MapComponent from './components/MapComponent';
import LoginModal from './components/LoginModal';
import LoadingOverlay from './components/LoadingOverlay';
import Notification from './components/Notification';
import TokenNotification from './components/TokenNotification';
import {
  useAuthStore,
  useRiskAreasStore,
  useTokenStore,
  useSubmissionsStore,
  useRoadmapStore
} from './stores';
import 'leaflet/dist/leaflet.css';

function App() {
  const { initializeAuth } = useAuthStore();
  const { 
    isInfoPanelOpen, 
    toggleInfoPanel,
    getSelectedArea,
    fetchRiskAreas
  } = useRiskAreasStore();
  const { tokenNotification } = useTokenStore();
  const { loadUserData, setUserData } = useSubmissionsStore();
  const { loadExampleRoadmaps } = useRoadmapStore();

  useEffect(() => {
    const initializeApp = async () => {
      initializeAuth();
      await fetchRiskAreas();
      
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = loadUserData('demo');
        setUserData(userData);
      }

      loadExampleRoadmaps();
    };

    initializeApp();
  }, [initializeAuth, fetchRiskAreas, loadUserData, setUserData, loadExampleRoadmaps]);

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
      {tokenNotification.show && <TokenNotification />}
    </>
  );
}

export default App;
