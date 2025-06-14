import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import useAppStore from '../stores/useAppStore';

const MapComponent = () => {
  const { riskAreas, selectArea, fetchRiskAreas, isLoginModalOpen } = useAppStore();
  const goiasCenter = [-15.9339, -49.8333];

  useEffect(() => {
    fetchRiskAreas();
  }, [fetchRiskAreas]);

  const handleCircleClick = (areaData) => {
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
            <Popup>
              <div>
                <strong>{areaData.nome}</strong><br />
                ID: {areaData.id}<br />
                {areaData.municipio && (
                  <>
                   <strong> Município:</strong> {areaData.municipio}<br />
                  </>
                )}

                {areaData.bairro && (
                  <>
                   <strong> Bairro:</strong> {areaData.bairro}<br />
                  </>
                )}
                {areaData.descricao && (
                  <>
                   <strong> Descrição:</strong> {areaData.descricao}<br />
                  </>
                )}
                {areaData.nivelAmeaca && (
                  <>
                   <strong> Nível de Risco: </strong> {areaData.nivelAmeaca}<br />
                  </>
                )}
                {areaData.tipoRisco && (
                  <>
                   <strong> Tipo de Risco: </strong> {areaData.tipoRisco}<br />
                  </>
                )}
                {areaData.responsavelDC && (
                  <>
                   <strong> Responsável Técnico: </strong> {areaData.responsavelDC}<br />
                  </>
                )}
                {areaData.dataCadastro && (
                  <>
                   <strong> Data de cadastro: </strong> {areaData.dataCadastro}<br />
                  </>
                )}
                {areaData.ultimaAtualizacao && (
                  <>
                   <strong> Ultima Atualização: </strong> {areaData.ultimaAtualizacao}<br />
                  </>
                )}
                <hr />
                <br />
                <label>
                  <input type="checkbox" style={{ marginRight: 4 }} />
                  Confirmo que esta área é de risco
                </label>
                <br />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Funcionalidade de envio de anexo não implementada.');
                  }}
                  style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Enviar anexo
                </a>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
