import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const RemovalRequestModal = ({ isOpen, onClose, areaToRemove }) => {
  const { requestAreaRemoval, loading } = useAppStore();
  
  const [reason, setReason] = useState('');
  const [justification, setJustification] = useState('');
  const [errors, setErrors] = useState({});

  const removalReasons = [
    { value: 'RISK_RESOLVED', label: 'Risco Resolvido', description: 'Área foi estabilizada ou teve o risco mitigado' },
    { value: 'INCORRECT_CLASSIFICATION', label: 'Classificação Incorreta', description: 'Área foi incorretamente classificada como risco' },
    { value: 'AREA_REMOVED', label: 'Área Removida', description: 'Área física foi removida ou modificada significativamente' },
    { value: 'DUPLICATE_ENTRY', label: 'Entrada Duplicada', description: 'Área já está cadastrada em outro registro' },
    { value: 'OTHER', label: 'Outro Motivo', description: 'Especificar outro motivo na justificativa' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!reason) {
      newErrors.reason = 'Selecione um motivo para a remoção';
    }

    if (!justification.trim()) {
      newErrors.justification = 'Justificativa é obrigatória';
    } else if (justification.trim().length < 20) {
      newErrors.justification = 'Justificativa deve ter pelo menos 20 caracteres';
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
      const request = requestAreaRemoval(areaToRemove?.id, reason, justification.trim());
      
      if (request) {
        setReason('');
        setJustification('');
        setErrors({});
        onClose();
        
        alert(`✅ Solicitação de remoção enviada com sucesso!\n\nID: ${request.id}\nStatus: Aguardando aprovação\n\n⚠️ A solicitação será analisada pela Defesa Civil antes da remoção.`);
      }
    } catch (error) {
      console.error('Erro ao solicitar remoção:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const handleClose = () => {
    setReason('');
    setJustification('');
    setErrors({});
    onClose();
  };

  if (!isOpen || !areaToRemove) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Solicitar Remoção de Área</h2>
              <p className="text-red-100 text-sm mt-1">
                {areaToRemove.nome} ({areaToRemove.id})
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-red-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-500 text-xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-yellow-800">Aviso Importante</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Esta solicitação será analisada pela Defesa Civil. A remoção só será efetivada após aprovação das autoridades competentes.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Motivo da Remoção *
              </label>
              <div className="space-y-3">
                {removalReasons.map((reasonOption) => (
                  <label key={reasonOption.value} className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="reason"
                      value={reasonOption.value}
                      checked={reason === reasonOption.value}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (errors.reason) {
                          setErrors(prev => ({ ...prev, reason: '' }));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 group-hover:text-red-600">
                        {reasonOption.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reasonOption.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.reason && (
                <p className="text-red-600 text-sm mt-2">{errors.reason}</p>
              )}
            </div>
            <div>
              <label htmlFor="justification" className="block text-sm font-semibold text-gray-700 mb-2">
                Justificativa Detalhada *
              </label>
              <textarea
                id="justification"
                rows="6"
                value={justification}
                onChange={(e) => {
                  setJustification(e.target.value);
                  if (errors.justification) {
                    setErrors(prev => ({ ...prev, justification: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                  errors.justification ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descreva detalhadamente o motivo da solicitação de remoção. Inclua informações sobre vistorias técnicas, obras realizadas, ou qualquer outro dado relevante..."
              />
              <div className="flex justify-between mt-1">
                {errors.justification && (
                  <p className="text-red-600 text-sm">{errors.justification}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {justification.length}/500 caracteres
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Informações da Área</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nome:</strong> {areaToRemove.nome}</p>
                  <p><strong>Município:</strong> {areaToRemove.municipio}</p>
                  <p><strong>Bairro:</strong> {areaToRemove.bairro}</p>
                </div>
                <div>
                  <p><strong>Tipo de Risco:</strong> {areaToRemove.tipoRisco}</p>
                  <p><strong>Nível de Ameaça:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      areaToRemove.nivelAmeaca === 'Alto' ? 'bg-red-100 text-red-800' :
                      areaToRemove.nivelAmeaca === 'Médio' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {areaToRemove.nivelAmeaca}
                    </span>
                  </p>
                  <p><strong>Data de Cadastro:</strong> {areaToRemove.dataCadastro}</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            * Campos obrigatórios
          </div>
          <div className="space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Solicitar Remoção'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RemovalRequestModal;
