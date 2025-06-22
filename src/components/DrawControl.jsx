import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const DrawControl = ({ map, onAreaDrawn, isEnabled = false }) => {
  useEffect(() => {
    if (!map || !isEnabled) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      edit: {
        featureGroup: drawnItems,
        remove: true
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e1e100',
            message: '<strong>Erro:</strong> Você não pode desenhar assim!'
          },
          shapeOptions: {
            color: '#ff0000',
            weight: 2,
            fillOpacity: 0.3
          }
        },
        polyline: {
          shapeOptions: {
            color: '#ff0000',
            weight: 3,
            opacity: 0.8
          }
        },
        circle: {
          shapeOptions: {
            color: '#ff0000',
            weight: 2,
            fillOpacity: 0.3
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#ff0000',
            weight: 2,
            fillOpacity: 0.3
          }
        },
        marker: {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        },
        circlemarker: {
          radius: 10,
          shapeOptions: {
            color: '#ff0000',
            fillColor: '#ff0000',
            fillOpacity: 0.6
          }
        }
      }
    });

    map.addControl(drawControl);

    const onDrawCreated = (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      let coordinates = null;
      let areaType = e.layerType;

      if (e.layerType === 'polygon') {
        coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      } else if (e.layerType === 'circle') {
        const center = layer.getLatLng();
        const radius = layer.getRadius();
        coordinates = {
          center: [center.lat, center.lng],
          radius: radius
        };
      } else if (e.layerType === 'rectangle') {
        const bounds = layer.getBounds();
        coordinates = [
          [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
          [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
        ];
      } else if (e.layerType === 'polyline') {
        coordinates = layer.getLatLngs().map(latlng => [latlng.lat, latlng.lng]);
      } else if (e.layerType === 'marker') {
        const position = layer.getLatLng();
        coordinates = [position.lat, position.lng];
      } else if (e.layerType === 'circlemarker') {
        const position = layer.getLatLng();
        const radius = layer.getRadius();
        coordinates = {
          center: [position.lat, position.lng],
          radius: radius
        };
      }

      let areaSize = 0;
      if (e.layerType === 'polygon') {
        areaSize = L.GeometryUtil ? L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) : 0;
      } else if (e.layerType === 'circle') {
        areaSize = Math.PI * Math.pow(layer.getRadius(), 2);
      } else if (e.layerType === 'rectangle') {
        const bounds = layer.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const width = sw.distanceTo(L.latLng(sw.lat, ne.lng));
        const height = sw.distanceTo(L.latLng(ne.lat, sw.lng));
        areaSize = width * height;
      } else if (e.layerType === 'polyline') {
        const latlngs = layer.getLatLngs();
        let distance = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
          distance += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        areaSize = distance;
      } else if (e.layerType === 'circlemarker') {
        const radius = layer.getRadius();
        const radiusInMeters = radius * 1;
        areaSize = Math.PI * Math.pow(radiusInMeters, 2);
      } else if (e.layerType === 'marker') {
        areaSize = 0;
      }

      onAreaDrawn({
        coordinates,
        areaType,
        areaSize: Math.round(areaSize),
        layer
      });
    };

    map.on('draw:created', onDrawCreated);

    return () => {
      map.off('draw:created', onDrawCreated);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onAreaDrawn, isEnabled]);

  return null;
};

export default DrawControl;
