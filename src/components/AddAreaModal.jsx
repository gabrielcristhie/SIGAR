import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useRiskAreasStore from '../stores/useRiskAreasStore';

const AddAreaModal = ({ isOpen, onClose, areaData }) => {
  const { addArea, isLoading } = useRiskAreasStore();
  
  const formatDrawingInfo = (type, size) => {
    const typeLabels = {
      polygon: 'Polígono',
      circle: 'Círculo',
      rectangle: 'Retângulo',
      polyline: 'Linha/Trajeto',
      marker: 'Marcador',
      circlemarker: 'Marcador Circular'
    };

    const typeLabel = typeLabels[type] || type;
    
    if (!size || size === 0) {
      return typeLabel;
    }

    if (type === 'polyline') {
      if (size >= 1000) {
        return `${typeLabel} • ${(size / 1000).toFixed(2)} km`;
      } else {
        return `${typeLabel} • ${size.toFixed(0)} metros`;
      }
    } else if (type === 'marker') {
      return typeLabel;
    } else {
      if (size >= 1000000) {
        return `${typeLabel} • ${(size / 1000000).toFixed(2)} km²`;
      } else if (size >= 10000) {
        return `${typeLabel} • ${(size / 10000).toFixed(2)} hectares`;
      } else {
        return `${typeLabel} • ${size.toFixed(0)} m²`;
      }
    }
  };

  const [formData, setFormData] = useState({
    nome: '',
    municipio: 'Goiânia',
    bairro: '',
    tipoRisco: '',
    nivelAmeaca: '',
    populacaoAfetada: '',
    descricao: '',
    observacoes: ''
  });
  
  const [errors, setErrors] = useState({});

  const tiposRisco = [
    { value: 'DESLIZAMENTO', label: 'Deslizamento de Terra' },
    { value: 'INUNDACAO', label: 'Inundação' },
    { value: 'ALAGAMENTO', label: 'Alagamento' },
    { value: 'EROSAO', label: 'Erosão' },
    { value: 'CONTAMINACAO', label: 'Contaminação do Solo' },
    { value: 'INCENDIO', label: 'Risco de Incêndio' },
    { value: 'ESTRUTURAL', label: 'Risco Estrutural' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  const niveisAmeaca = [
    { value: 'BAIXO', label: 'Baixo', color: 'text-green-600' },
    { value: 'MEDIO', label: 'Médio', color: 'text-yellow-600' },
    { value: 'ALTO', label: 'Alto', color: 'text-orange-600' },
    { value: 'MUITO_ALTO', label: 'Muito Alto', color: 'text-red-600' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da área é obrigatório';
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.tipoRisco) {
      newErrors.tipoRisco = 'Tipo de risco é obrigatório';
    }

    if (!formData.nivelAmeaca) {
      newErrors.nivelAmeaca = 'Nível de ameaça é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 20) {
      newErrors.descricao = 'Descrição deve ter pelo menos 20 caracteres';
    }

    if (formData.populacaoAfetada && (isNaN(formData.populacaoAfetada) || parseInt(formData.populacaoAfetada) < 0)) {
      newErrors.populacaoAfetada = 'População deve ser um número válido';
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
      const newArea = {
        id: `AREA-${Date.now()}`,
        nome: formData.nome.trim(),
        municipio: formData.municipio,
        bairro: formData.bairro.trim(),
        tipoRisco: formData.tipoRisco,
        nivelAmeaca: formData.nivelAmeaca,
        populacaoAfetada: parseInt(formData.populacaoAfetada) || 0,
        descricao: formData.descricao.trim(),
        observacoes: formData.observacoes.trim(),
        dataCadastro: new Date().toISOString().split('T')[0],
        status: 'ATIVA',
        coordinates: areaData?.coordinates,
        areaType: areaData?.areaType,
        areaSize: areaData?.areaSize,
        lat: areaData?.coordinates?.[0]?.[0] || 0,
        lng: areaData?.coordinates?.[0]?.[1] || 0
      };

      const success = await addArea(newArea);
      
      if (success) {
        handleClose();
        alert(`✅ Área de risco "${newArea.nome}" cadastrada com sucesso!\n\nID: ${newArea.id}\nTipo: ${formatDrawingInfo(areaData?.areaType, areaData?.areaSize)}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar área:', error);
      alert('Erro ao cadastrar área. Tente novamente.');
    }
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      municipio: 'Goiânia',
      bairro: '',
      tipoRisco: '',
      nivelAmeaca: '',
      populacaoAfetada: '',
      descricao: '',
      observacoes: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !areaData) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-green-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Cadastrar Nova Área de Risco</h2>
              <p className="text-green-100 text-sm mt-1">
                Área desenhada: {formatDrawingInfo(areaData.areaType, areaData.areaSize)}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              {/* Nome da Área */}
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Área *
                </label>
                <input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Encosta do Morro das Pedras"
                />
                {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="municipio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Município *
                  </label>
                  <select
                    id="municipio"
                    value={formData.municipio}
                    onChange={(e) => handleInputChange('municipio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Goiânia">Goiânia</option>
                    <option value="Aparecida de Goiânia">Aparecida de Goiânia</option>
                    <option value="Anápolis">Anápolis</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bairro" className="block text-sm font-semibold text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    id="bairro"
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange('bairro', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.bairro ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Setor Central"
                  />
                  {errors.bairro && <p className="text-red-600 text-sm mt-1">{errors.bairro}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Risco *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tiposRisco.map((tipo) => (
                    <label key={tipo.value} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        name="tipoRisco"
                        value={tipo.value}
                        checked={formData.tipoRisco === tipo.value}
                        onChange={(e) => handleInputChange('tipoRisco', e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="text-sm">{tipo.label}</span>
                    </label>
                  ))}
                </div>
                {errors.tipoRisco && <p className="text-red-600 text-sm mt-1">{errors.tipoRisco}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nível de Ameaça *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {niveisAmeaca.map((nivel) => (
                    <label key={nivel.value} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        name="nivelAmeaca"
                        value={nivel.value}
                        checked={formData.nivelAmeaca === nivel.value}
                        onChange={(e) => handleInputChange('nivelAmeaca', e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`text-sm font-medium ${nivel.color}`}>{nivel.label}</span>
                    </label>
                  ))}
                </div>
                {errors.nivelAmeaca && <p className="text-red-600 text-sm mt-1">{errors.nivelAmeaca}</p>}
              </div>
              <div>
                <label htmlFor="populacaoAfetada" className="block text-sm font-semibold text-gray-700 mb-2">
                  População Afetada (estimativa)
                </label>
                <input
                  id="populacaoAfetada"
                  type="number"
                  min="0"
                  value={formData.populacaoAfetada}
                  onChange={(e) => handleInputChange('populacaoAfetada', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.populacaoAfetada ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 150"
                />
                {errors.populacaoAfetada && <p className="text-red-600 text-sm mt-1">{errors.populacaoAfetada}</p>}
              </div>
              <div>
                <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  id="descricao"
                  rows="4"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                    errors.descricao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva as características da área, histórico de ocorrências, condições do terreno, proximidade de moradias..."
                />
                <div className="flex justify-between mt-1">
                  {errors.descricao && <p className="text-red-600 text-sm">{errors.descricao}</p>}
                  <p className="text-gray-500 text-sm ml-auto">{formData.descricao.length}/500 caracteres</p>
                </div>
              </div>

              <div>
                <label htmlFor="observacoes" className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  id="observacoes"
                  rows="3"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Informações complementares, contatos de referência, medidas já tomadas..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Área de Risco'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddAreaModal;
