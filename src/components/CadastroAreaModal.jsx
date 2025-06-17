import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const CadastroAreaModal = ({ isOpen, onClose }) => {
  const { addRiskArea, loading, addUserSubmission } = useAppStore();
  
  const [formData, setFormData] = useState({
    nome: '',
    municipio: '',
    bairro: '',
    tipoRisco: '',
    nivelAmeaca: 'Baixo',
    descricao: '',
    responsavelDC: '',
    coordenadas: []
  });

  const [coordenadasInput, setCoordenadasInput] = useState('');
  const [tipoDesenho, setTipoDesenho] = useState('poligono');
  const [errors, setErrors] = useState({});

  const tiposRisco = [
    'Deslizamento Rotacional',
    'Deslizamento Planar', 
    'Fluxo de Detritos',
    'Queda de Blocos',
    'Inundação',
    'Erosão',
    'Outros'
  ];

  const niveisAmeaca = [
    { value: 'Baixo', color: 'yellow', colorMapa: '#FFD700' },
    { value: 'Médio', color: 'orange', colorMapa: '#FFA500' },
    { value: 'Alto', color: 'red', colorMapa: '#FF0000' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const parseCoordinates = (coordsText) => {
    try {
      const cleanText = coordsText.trim();
      
      if (!cleanText) {
        throw new Error('Coordenadas não podem estar vazias');
      }
      let coords = [];
      
      const lines = cleanText.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        const parts = trimmedLine.split(',');
        if (parts.length !== 2) {
          throw new Error(`Formato inválido na linha: "${trimmedLine}". Use: latitude,longitude`);
        }
        
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error(`Coordenadas inválidas na linha: "${trimmedLine}"`);
        }
        
        if (lat < -34 || lat > 6 || lng < -75 || lng > -30) {
          throw new Error(`Coordenadas fora do Brasil na linha: "${trimmedLine}"`);
        }
        
        coords.push([lat, lng]);
      }
      
      if (tipoDesenho === 'retangulo' && coords.length !== 2) {
        throw new Error('Para retângulo, forneça exatamente 2 coordenadas (diagonal)');
      }
      
      if (tipoDesenho === 'poligono' && coords.length < 3) {
        throw new Error('Para polígono, forneça pelo menos 3 coordenadas');
      }
      
      if (tipoDesenho === 'retangulo' && coords.length === 2) {
        const [coord1, coord2] = coords;
        const minLat = Math.min(coord1[0], coord2[0]);
        const maxLat = Math.max(coord1[0], coord2[0]);
        const minLng = Math.min(coord1[1], coord2[1]);
        const maxLng = Math.max(coord1[1], coord2[1]);
        
        coords = [
          [minLat, minLng], 
          [maxLat, minLng],
          [maxLat, maxLng],
          [minLat, maxLng]
        ];
      }
      
      return coords;
    } catch (error) {
      throw new Error(`Erro ao processar coordenadas: ${error.message}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.municipio.trim()) {
      newErrors.municipio = 'Município é obrigatório';
    }
    
    if (!formData.tipoRisco) {
      newErrors.tipoRisco = 'Tipo de risco é obrigatório';
    }
    
    if (!coordenadasInput.trim()) {
      newErrors.coordenadas = 'Coordenadas são obrigatórias';
    } else {
      try {
        parseCoordinates(coordenadasInput);
      } catch (error) {
        newErrors.coordenadas = error.message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const coordenadas = parseCoordinates(coordenadasInput);
      const nivelConfig = niveisAmeaca.find(n => n.value === formData.nivelAmeaca);
      
      const newArea = {
        id: `R${Date.now()}-USER-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        nome: formData.nome,
        municipio: formData.municipio,
        bairro: formData.bairro || 'Não informado',
        tipoRisco: formData.tipoRisco,
        nivelAmeaca: formData.nivelAmeaca,
        corNivelTailwind: `bg-${nivelConfig.color}-100 text-${nivelConfig.color}-800 border-${nivelConfig.color}-500`,
        corMapa: nivelConfig.colorMapa,
        opacidadeMapa: 0.6,
        coordenadas: coordenadas,
        responsavelDC: formData.responsavelDC || 'Usuário do Sistema',
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
        ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
        descricao: formData.descricao || 'Área cadastrada pelo usuário',
        fatoresNaturais: '',
        fatoresAntropicos: '',
        evidencias: '',
        populacaoExposta: '',
        edificacoesExpostas: '',
        infraestruturaExposta: '',
        historicoIncidentes: [],
        acoesMitigadoras: '',
        medidasRecomendadas: '',
        statusMonitoramento: 'Cadastrada - Aguardando Vistoria',
        anexos: []
      };
      
      await addRiskArea(newArea);
      addUserSubmission(newArea, 'NEW_AREA');
      
      setFormData({
        nome: '',
        municipio: '',
        bairro: '',
        tipoRisco: '',
        nivelAmeaca: 'Baixo',
        descricao: '',
        responsavelDC: '',
        coordenadas: []
      });
      setCoordenadasInput('');
      setErrors({});
      
      onClose();
      
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      municipio: '',
      bairro: '',
      tipoRisco: '',
      nivelAmeaca: 'Baixo',
      descricao: '',
      responsavelDC: '',
      coordenadas: []
    });
    setCoordenadasInput('');
    setErrors({});
    onClose();
  };

  const exemploCoordenadasRetangulo = `-16.6869,-49.2648
-16.6800,-49.2580`;

  const exemploCoordenadasPoligono = `-16.6869,-49.2648
-16.6850,-49.2630
-16.6830,-49.2650
-16.6840,-49.2670
-16.6860,-49.2665`;

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Cadastrar Nova Área de Risco
              </h2>
              <button 
                onClick={handleClose} 
                className="text-gray-500 hover:text-gray-800 text-xl p-1"
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Área *
                  </label>
                  <input 
                    type="text" 
                    id="nome" 
                    name="nome" 
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: Encosta do Morro Verde"
                  />
                  {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                    Município *
                  </label>
                  <input 
                    type="text" 
                    id="municipio" 
                    name="municipio" 
                    value={formData.municipio}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.municipio ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: Goiânia"
                  />
                  {errors.municipio && <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>}
                </div>

                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro/Localidade
                  </label>
                  <input 
                    type="text" 
                    id="bairro" 
                    name="bairro" 
                    value={formData.bairro}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Jardim das Oliveiras"
                  />
                </div>

                <div>
                  <label htmlFor="tipoRisco" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Risco *
                  </label>
                  <select 
                    id="tipoRisco" 
                    name="tipoRisco" 
                    value={formData.tipoRisco}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tipoRisco ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Selecione o tipo de risco</option>
                    {tiposRisco.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                  {errors.tipoRisco && <p className="text-red-500 text-xs mt-1">{errors.tipoRisco}</p>}
                </div>

                <div>
                  <label htmlFor="nivelAmeaca" className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Ameaça
                  </label>
                  <select 
                    id="nivelAmeaca" 
                    name="nivelAmeaca" 
                    value={formData.nivelAmeaca}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {niveisAmeaca.map(nivel => (
                      <option key={nivel.value} value={nivel.value}>{nivel.value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="responsavelDC" className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável DC
                  </label>
                  <input 
                    type="text" 
                    id="responsavelDC" 
                    name="responsavelDC" 
                    value={formData.responsavelDC}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Agente Silva (Mat. 12345)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Área
                </label>
                <textarea 
                  id="descricao" 
                  name="descricao" 
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva as características da área de risco..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Área
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="tipoDesenho" 
                      value="retangulo"
                      checked={tipoDesenho === 'retangulo'}
                      onChange={(e) => setTipoDesenho(e.target.value)}
                      className="mr-2"
                    />
                    Retângulo (2 coordenadas)
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="tipoDesenho" 
                      value="poligono"
                      checked={tipoDesenho === 'poligono'}
                      onChange={(e) => setTipoDesenho(e.target.value)}
                      className="mr-2"
                    />
                    Polígono (3+ coordenadas)
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="coordenadas" className="block text-sm font-medium text-gray-700 mb-1">
                  Coordenadas (Latitude, Longitude) *
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <textarea 
                      id="coordenadas" 
                      value={coordenadasInput}
                      onChange={(e) => setCoordenadasInput(e.target.value)}
                      rows="6"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${errors.coordenadas ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder={`Cole suas coordenadas aqui...
Ex:
-16.6869,-49.2648
-16.6850,-49.2630`}
                    />
                    {errors.coordenadas && <p className="text-red-500 text-xs mt-1">{errors.coordenadas}</p>}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Exemplos de Coordenadas:
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Retângulo (2 pontos diagonal):</p>
                        <pre className="text-xs bg-white p-2 rounded border font-mono">
{exemploCoordenadasRetangulo}
                        </pre>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-600">Polígono (vários pontos):</p>
                        <pre className="text-xs bg-white p-2 rounded border font-mono">
{exemploCoordenadasPoligono}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-600">
                      <p><strong>Formato:</strong> Uma coordenada por linha</p>
                      <p><strong>Padrão:</strong> latitude,longitude</p>
                      <p><strong>Separador:</strong> vírgula</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-150 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar Área'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CadastroAreaModal;
