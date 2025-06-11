import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import useAppStore from '../stores/useAppStore';

const MapComponent = () => {
  const { riskAreas, selectArea, fetchRiskAreas, isLoginModalOpen } = useAppStore();
  const goiasCenter = [-15.9339, -49.8333];

  useEffect(() => {
    fetchRiskAreas();
  }, [fetchRiskAreas]);

  const handleCircleClick = (areaData) => {
    // Não permitir seleção de área se modal estiver aberto
    if (!isLoginModalOpen) {
      selectArea(areaData.id);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer 
        center={goiasCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Object.values(riskAreas).map((areaData) => (
          <Circle
            key={areaData.id}
            center={[areaData.coordenadas.lat, areaData.coordenadas.lng]}
            radius={areaData.raioMapa}
            pathOptions={{
              color: areaData.corMapa,
              fillColor: areaData.corMapa,
              fillOpacity: areaData.opacidadeMapa,
            }}
            eventHandlers={{
              click: () => handleCircleClick(areaData),
            }}
          >
            <Popup>
              <div>
                <strong>{areaData.nome}</strong><br />
                ID: {areaData.id}
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
