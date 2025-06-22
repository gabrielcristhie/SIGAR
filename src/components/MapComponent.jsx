import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import useRiskAreasStore from '../stores/useRiskAreasStore';
import useAuthStore from '../stores/useAuthStore';
import DrawControl from './DrawControl';
import AddAreaModal from './AddAreaModal';

const MapComponent = ({ isDrawMode = false, onDrawModeChange }) => {
  const { riskAreas, selectArea, fetchRiskAreas, toggleInfoPanel } = useRiskAreasStore();
  const { isLoginModalOpen } = useAuthStore();
  const mapRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAreaData, setNewAreaData] = useState(null);
  
  const goiasCenter = [-15.9339, -49.8333];

  useEffect(() => {
    fetchRiskAreas();
  }, [fetchRiskAreas]);

  const handleCircleClick = (areaData) => {
    if (!isLoginModalOpen) {
      selectArea(areaData.id);
    }
  };

  const handleViewDetails = (areaData) => {
    selectArea(areaData.id);
    toggleInfoPanel(true);
  };

  const handleAreaDrawn = (areaData) => {
    setNewAreaData(areaData);
    setIsAddModalOpen(true);
    if (onDrawModeChange) {
      onDrawModeChange(false);
    }
  };

  const handleMapReady = (map) => {
    mapRef.current = map;
  };

  const getRiskColor = (nivelAmeaca) => {
    switch(nivelAmeaca?.toLowerCase()) {
      case 'alto': return '#ef4444';
      case 'médio': return '#f97316';
      case 'baixo': return '#eab308';
      default: return '#6b7280';
    }
  };

  const getRiskBadgeColor = (nivelAmeaca) => {
    switch(nivelAmeaca?.toLowerCase()) {
      case 'alto': return 'bg-red-100 text-red-800 border-red-200';
      case 'médio': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'baixo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer
        center={goiasCenter}
        zoom={8}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        whenReady={({ target }) => handleMapReady(target)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <DrawControl 
          map={mapRef.current} 
          onAreaDrawn={handleAreaDrawn}
          isEnabled={isDrawMode}
        />

        {Object.values(riskAreas).map((areaData) => (
          <Polygon
            key={areaData.id}
            positions={areaData.coordenadas}
            pathOptions={{
              color: areaData.corMapa,
              fillColor: areaData.corMapa,
              fillOpacity: areaData.opacidadeMapa,
              weight: 2
            }}
            eventHandlers={{
              click: () => handleCircleClick(areaData),
            }}
          >
            <Popup className="modern-popup">
              <div className="bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]">
                <div className="border-b border-gray-200 pb-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {areaData.nome}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {areaData.id}</p>
                </div>

                {areaData.nivelAmeaca && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-3 ${getRiskBadgeColor(areaData.nivelAmeaca)}`}>
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: getRiskColor(areaData.nivelAmeaca) }}
                    ></div>
                    {areaData.nivelAmeaca} Risco
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  {areaData.municipio && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Local:</span>
                      <span className="text-gray-600">
                        {areaData.municipio}{areaData.bairro && `, ${areaData.bairro}`}
                      </span>
                    </div>
                  )}

                  {areaData.tipoRisco && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Tipo:</span>
                      <span className="text-gray-600">{areaData.tipoRisco}</span>
                    </div>
                  )}

                  {areaData.responsavelDC && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Técnico:</span>
                      <span className="text-gray-600">{areaData.responsavelDC}</span>
                    </div>
                  )}

                  {areaData.dataCadastro && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Cadastro:</span>
                      <span className="text-gray-600">{areaData.dataCadastro}</span>
                    </div>
                  )}
                </div>

                {areaData.descricao && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {areaData.descricao}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleViewDetails(areaData)}
                      className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg w-full"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
      
      <AddAreaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        areaData={newAreaData}
      />
    </div>
  );
};

export default MapComponent;
