import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const RemovalManagementModal = ({ isOpen, onClose }) => {
  const { removalRequests, approveRemovalRequest, rejectRemovalRequest, getRemovalRequestStats } = useAppStore();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [reviewNotes, setReviewNotes] = useState({});
  
  const stats = getRemovalRequestStats();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'PENDING': return '⏳';
      default: return '❓';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'HIGH': return 'Alta';
      case 'MEDIUM': return 'Média';
      case 'LOW': return 'Baixa';
      default: return 'Normal';
    }
  };

  const getReasonText = (reason) => {
    switch (reason) {
      case 'RISK_RESOLVED': return 'Risco Resolvido';
      case 'INCORRECT_CLASSIFICATION': return 'Classificação Incorreta';
      case 'AREA_REMOVED': return 'Área Removida';
      case 'DUPLICATE_ENTRY': return 'Entrada Duplicada';
      case 'OTHER': return 'Outro Motivo';
      default: return reason;
    }
  };

  const filteredRequests = removalRequests.filter(request => {
    if (selectedTab === 'pending') return request.status === 'PENDING';
    if (selectedTab === 'approved') return request.status === 'APPROVED';
    if (selectedTab === 'rejected') return request.status === 'REJECTED';
    return true;
  });

  const handleApprove = (requestId) => {
    const notes = reviewNotes[requestId] || '';
    if (window.confirm('Tem certeza que deseja APROVAR esta solicitação? A área será removida permanentemente do sistema.')) {
      approveRemovalRequest(requestId, notes);
      setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
    }
  };

  const handleReject = (requestId) => {
    const notes = reviewNotes[requestId] || '';
    if (!notes.trim()) {
      alert('Por favor, adicione uma justificativa para a rejeição.');
      return;
    }
    if (window.confirm('Tem certeza que deseja REJEITAR esta solicitação?')) {
      rejectRemovalRequest(requestId, notes);
      setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
    }
  };

  const updateReviewNotes = (requestId, notes) => {
    setReviewNotes(prev => ({ ...prev, [requestId]: notes }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🛡️ Gerenciamento de Solicitações de Remoção</h2>
              <p className="text-purple-100 text-sm mt-1">Defesa Civil - Área Administrativa</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalRequests}</div>
              <div className="text-sm text-purple-700">Total</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              <div className="text-sm text-orange-700">Pendentes</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
              <div className="text-sm text-green-700">Aprovadas</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</div>
              <div className="text-sm text-red-700">Rejeitadas</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pendentes ({stats.pendingRequests})
              </button>
              <button
                onClick={() => setSelectedTab('approved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Aprovadas ({stats.approvedRequests})
              </button>
              <button
                onClick={() => setSelectedTab('rejected')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'rejected'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejeitadas ({stats.rejectedRequests})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Todas ({stats.totalRequests})
              </button>
            </nav>
          </div>

          {/* Lista de Solicitações */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>Nenhuma solicitação encontrada para esta categoria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{request.areaName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {getPriorityText(request.priority)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'APPROVED' ? 'text-green-600 bg-green-100' :
                          request.status === 'REJECTED' ? 'text-red-600 bg-red-100' :
                          'text-orange-600 bg-orange-100'
                        }`}>
                          {getStatusIcon(request.status)} {request.status === 'PENDING' ? 'Pendente' : request.status === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>ID da Área:</strong> {request.areaId} | <strong>Solicitante:</strong> {request.requestedBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Data:</strong> {new Date(request.requestedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Motivo:</strong> {getReasonText(request.reason)}
                      </p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p className="font-medium text-gray-700 mb-1">Justificativa:</p>
                        <p className="text-gray-600">{request.justification}</p>
                      </div>
                    </div>
                    
                    {request.reviewedAt && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Revisado por:</strong> {request.reviewedBy}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Data da Revisão:</strong> {new Date(request.reviewedAt).toLocaleDateString('pt-BR')}
                        </p>
                        {request.reviewNotes && (
                          <div className="bg-blue-50 p-3 rounded text-sm">
                            <p className="font-medium text-blue-700 mb-1">Observações da Revisão:</p>
                            <p className="text-blue-600">{request.reviewNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ações (apenas para solicitações pendentes) */}
                  {request.status === 'PENDING' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações da Revisão:
                        </label>
                        <textarea
                          rows="3"
                          value={reviewNotes[request.id] || ''}
                          onChange={(e) => updateReviewNotes(request.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Adicione observações sobre a decisão (obrigatório para rejeição)..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <span>✅</span>
                          <span>Aprovar e Remover Área</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <span>❌</span>
                          <span>Rejeitar Solicitação</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Defesa Civil de Goiás</span> - Sistema de Gerenciamento de Áreas de Risco
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RemovalManagementModal;
