import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const EditarAreaModal = ({ isOpen, onClose, areaToEdit }) => {
  const { updateRiskArea, loading } = useAppStore();
  
  console.log('🔧 EditarAreaModal - Props:', { isOpen, areaToEdit: !!areaToEdit });
  
  const [formData, setFormData] = useState({
    nome: '',
    municipio: '',
    bairro: '',
    tipoRisco: '',
    nivelAmeaca: 'Baixo',
    descricao: '',
    responsavelDC: '',
    fatoresNaturais: '',
    fatoresAntropicos: '',
    evidencias: '',
    populacaoExposta: '',
    edificacoesExpostas: '',
    infraestruturaExposta: '',
    acoesMitigadoras: '',
    medidasRecomendadas: '',
    statusMonitoramento: ''
  });

  const [coordenadasInput, setCoordenadasInput] = useState('');
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

  const statusOptions = [
    'Cadastrada - Aguardando Vistoria',
    'Monitorada - Informativo',
    'Monitorada - Atenção',
    'Monitorada - Alerta Laranja',
    'Monitorada Intensivamente - Alerta Vermelho',
    'Ativo - Vistorias semanais',
    'Ativo - Monitoramento pluviométrico',
    'Monitoramento trimestral'
  ];

  useEffect(() => {
    if (areaToEdit && isOpen) {
      setFormData({
        nome: areaToEdit.nome || '',
        municipio: areaToEdit.municipio || '',
        bairro: areaToEdit.bairro || '',
        tipoRisco: areaToEdit.tipoRisco || '',
        nivelAmeaca: areaToEdit.nivelAmeaca || 'Baixo',
        descricao: areaToEdit.descricao || '',
        responsavelDC: areaToEdit.responsavelDC || '',
        fatoresNaturais: areaToEdit.fatoresNaturais || '',
        fatoresAntropicos: areaToEdit.fatoresAntropicos || '',
        evidencias: areaToEdit.evidencias || '',
        populacaoExposta: areaToEdit.populacaoExposta || '',
        edificacoesExpostas: areaToEdit.edificacoesExpostas || '',
        infraestruturaExposta: areaToEdit.infraestruturaExposta || '',
        acoesMitigadoras: areaToEdit.acoesMitigadoras || '',
        medidasRecomendadas: areaToEdit.medidasRecomendadas || '',
        statusMonitoramento: areaToEdit.statusMonitoramento || ''
      });

      if (areaToEdit.coordenadas && Array.isArray(areaToEdit.coordenadas)) {
        const coordsText = areaToEdit.coordenadas
          .map(coord => `${coord[0]},${coord[1]}`)
          .join('\n');
        setCoordenadasInput(coordsText);
      }
    }
  }, [areaToEdit, isOpen]);

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
      
      if (coords.length < 3) {
        throw new Error('Para polígono, forneça pelo menos 3 coordenadas');
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
    
    console.log('💾 Tentando salvar alterações...');
    
    if (!validateForm()) {
      console.log('❌ Formulário inválido');
      return;
    }
    
    try {
      const coordenadas = parseCoordinates(coordenadasInput);
      const nivelConfig = niveisAmeaca.find(n => n.value === formData.nivelAmeaca);
      
      const updatedArea = {
        ...areaToEdit,
        nome: formData.nome,
        municipio: formData.municipio,
        bairro: formData.bairro,
        tipoRisco: formData.tipoRisco,
        nivelAmeaca: formData.nivelAmeaca,
        corNivelTailwind: `bg-${nivelConfig.color}-100 text-${nivelConfig.color}-800 border-${nivelConfig.color}-500`,
        corMapa: nivelConfig.colorMapa,
        coordenadas: coordenadas,
        descricao: formData.descricao,
        responsavelDC: formData.responsavelDC,
        fatoresNaturais: formData.fatoresNaturais,
        fatoresAntropicos: formData.fatoresAntropicos,
        evidencias: formData.evidencias,
        populacaoExposta: formData.populacaoExposta,
        edificacoesExpostas: formData.edificacoesExpostas,
        infraestruturaExposta: formData.infraestruturaExposta,
        acoesMitigadoras: formData.acoesMitigadoras,
        medidasRecomendadas: formData.medidasRecomendadas,
        statusMonitoramento: formData.statusMonitoramento,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
      };
      
      console.log('📝 Dados para atualização:', updatedArea);
      console.log('🔧 Função updateRiskArea disponível:', typeof updateRiskArea);
      
      await updateRiskArea(areaToEdit.id, updatedArea);
      
      console.log('✅ Área atualizada com sucesso');
      handleClose();
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
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
      fatoresNaturais: '',
      fatoresAntropicos: '',
      evidencias: '',
      populacaoExposta: '',
      edificacoesExpostas: '',
      infraestruturaExposta: '',
      acoesMitigadoras: '',
      medidasRecomendadas: '',
      statusMonitoramento: ''
    });
    setCoordenadasInput('');
    setErrors({});
    onClose();
  };

  if (!isOpen || !areaToEdit) return null;

  const modalContent = (
    <div className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Editar Área de Risco
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {areaToEdit.nome} (ID: {areaToEdit.id})
                </p>
              </div>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
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
                    />
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

                  <div className="md:col-span-2">
                    <label htmlFor="statusMonitoramento" className="block text-sm font-medium text-gray-700 mb-1">
                      Status do Monitoramento
                    </label>
                    <select 
                      id="statusMonitoramento" 
                      name="statusMonitoramento" 
                      value={formData.statusMonitoramento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione o status</option>
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição</h3>
                <textarea 
                  id="descricao" 
                  name="descricao" 
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva as características da área de risco..."
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fatores Condicionantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fatoresNaturais" className="block text-sm font-medium text-gray-700 mb-1">
                      Fatores Naturais
                    </label>
                    <textarea 
                      id="fatoresNaturais" 
                      name="fatoresNaturais" 
                      value={formData.fatoresNaturais}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="fatoresAntropicos" className="block text-sm font-medium text-gray-700 mb-1">
                      Fatores Antrópicos
                    </label>
                    <textarea 
                      id="fatoresAntropicos" 
                      name="fatoresAntropicos" 
                      value={formData.fatoresAntropicos}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="evidencias" className="block text-sm font-medium text-gray-700 mb-1">
                    Evidências de Instabilidade
                  </label>
                  <textarea 
                    id="evidencias" 
                    name="evidencias" 
                    value={formData.evidencias}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Impactos e Vulnerabilidades</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="populacaoExposta" className="block text-sm font-medium text-gray-700 mb-1">
                      População Exposta
                    </label>
                    <input 
                      type="text" 
                      id="populacaoExposta" 
                      name="populacaoExposta" 
                      value={formData.populacaoExposta}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="edificacoesExpostas" className="block text-sm font-medium text-gray-700 mb-1">
                      Edificações Expostas
                    </label>
                    <input 
                      type="text" 
                      id="edificacoesExpostas" 
                      name="edificacoesExpostas" 
                      value={formData.edificacoesExpostas}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="infraestruturaExposta" className="block text-sm font-medium text-gray-700 mb-1">
                      Infraestrutura Exposta
                    </label>
                    <input 
                      type="text" 
                      id="infraestruturaExposta" 
                      name="infraestruturaExposta" 
                      value={formData.infraestruturaExposta}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações e Medidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="acoesMitigadoras" className="block text-sm font-medium text-gray-700 mb-1">
                      Ações Mitigadoras Existentes
                    </label>
                    <textarea 
                      id="acoesMitigadoras" 
                      name="acoesMitigadoras" 
                      value={formData.acoesMitigadoras}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="medidasRecomendadas" className="block text-sm font-medium text-gray-700 mb-1">
                      Medidas Recomendadas
                    </label>
                    <textarea 
                      id="medidasRecomendadas" 
                      name="medidasRecomendadas" 
                      value={formData.medidasRecomendadas}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Localização (Coordenadas)</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="coordenadas" className="block text-sm font-medium text-gray-700 mb-1">
                      Coordenadas (Latitude, Longitude) *
                    </label>
                    <textarea 
                      id="coordenadas" 
                      value={coordenadasInput}
                      onChange={(e) => setCoordenadasInput(e.target.value)}
                      rows="8"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${errors.coordenadas ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Uma coordenada por linha, formato: latitude,longitude"
                    />
                    {errors.coordenadas && <p className="text-red-500 text-xs mt-1">{errors.coordenadas}</p>}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Instruções:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Uma coordenada por linha</li>
                      <li>• Formato: latitude,longitude</li>
                      <li>• Separador: vírgula</li>
                      <li>• Mínimo 3 pontos para polígono</li>
                      <li>• Coordenadas devem estar no Brasil</li>
                    </ul>
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
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
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

export default EditarAreaModal;
