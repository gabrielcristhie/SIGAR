import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const RequestManagementModal = ({ isOpen, onClose }) => {
  const { 
    removalRequests, 
    userSubmissions, 
    approveRemovalRequest, 
    rejectRemovalRequest,
    approveSubmission,
    rejectSubmission,
    getRemovalRequestStats,
    getSubmissionStats 
  } = useAppStore();
  
  const [selectedTab, setSelectedTab] = useState('removal_requests');
  const [reviewNotes, setReviewNotes] = useState({});
  
  const removalStats = getRemovalRequestStats();
  const submissionStats = getSubmissionStats();

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

  const getSubmissionTypeText = (type) => {
    switch (type) {
      case 'NEW_AREA': return 'Nova Área';
      case 'AREA_UPDATE': return 'Atualização';
      case 'AREA_CORRECTION': return 'Correção';
      default: return type;
    }
  };

  const getSubmissionTypeIcon = (type) => {
    switch (type) {
      case 'NEW_AREA': return '➕';
      case 'AREA_UPDATE': return '✏️';
      case 'AREA_CORRECTION': return '🔧';
      default: return '📝';
    }
  };

  const handleApproveRemoval = async (requestId) => {
    const notes = reviewNotes[requestId] || '';
    await approveRemovalRequest(requestId, notes);
    setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
  };

  const handleRejectRemoval = async (requestId) => {
    const notes = reviewNotes[requestId] || '';
    if (!notes.trim()) {
      alert('Por favor, forneça uma justificativa para a rejeição.');
      return;
    }
    await rejectRemovalRequest(requestId, notes);
    setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
  };

  const handleApproveSubmission = async (submissionId) => {
    const notes = reviewNotes[submissionId] || '';
    await approveSubmission(submissionId, notes);
    setReviewNotes(prev => ({ ...prev, [submissionId]: '' }));
  };

  const handleRejectSubmission = async (submissionId) => {
    const notes = reviewNotes[submissionId] || '';
    if (!notes.trim()) {
      alert('Por favor, forneça uma justificativa para a rejeição.');
      return;
    }
    await rejectSubmission(submissionId, notes);
    setReviewNotes(prev => ({ ...prev, [submissionId]: '' }));
  };

  const filteredRemovalRequests = removalRequests.filter(request => {
    if (selectedTab === 'removal_pending') return request.status === 'PENDING';
    if (selectedTab === 'removal_approved') return request.status === 'APPROVED';
    if (selectedTab === 'removal_rejected') return request.status === 'REJECTED';
    return selectedTab === 'removal_requests';
  });

  const filteredSubmissions = userSubmissions.filter(submission => {
    if (selectedTab === 'submission_pending') return submission.status === 'PENDING';
    if (selectedTab === 'submission_approved') return submission.status === 'APPROVED';
    if (selectedTab === 'submission_rejected') return submission.status === 'REJECTED';
    return selectedTab === 'submissions';
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Central de Gerenciamento de Solicitações</h2>
              <p className="text-blue-100 text-sm mt-1">
                Gerencie solicitações de adição e remoção de áreas de risco
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        <div className="bg-gray-50 border-b p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 text-center border">
              <div className="text-2xl font-bold text-red-600">{removalStats.total}</div>
              <div className="text-sm text-gray-600">Solicitações de Remoção</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border">
              <div className="text-2xl font-bold text-green-600">{submissionStats.total}</div>
              <div className="text-sm text-gray-600">Solicitações de Adição</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border">
              <div className="text-2xl font-bold text-yellow-600">{removalStats.pending + submissionStats.pending}</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border">
              <div className="text-2xl font-bold text-blue-600">{removalStats.approved + submissionStats.approved}</div>
              <div className="text-sm text-gray-600">Aprovadas</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-3 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTab('removal_requests')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'removal_requests'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗑️ Remoções ({removalStats.total})
            </button>
            <button
              onClick={() => setSelectedTab('removal_pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'removal_pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Pendentes ({removalStats.pending})
            </button>

            <button
              onClick={() => setSelectedTab('submissions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'submissions'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              ➕ Adições ({submissionStats.total})
            </button>
            <button
              onClick={() => setSelectedTab('submission_pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'submission_pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Pendentes ({submissionStats.pending})
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {(selectedTab.startsWith('removal') || selectedTab === 'removal_requests') && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Solicitações de Remoção ({filteredRemovalRequests.length})
                </h3>
              </div>

              {filteredRemovalRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">🗑️</div>
                  <p>Nenhuma solicitação de remoção encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRemovalRequests.map((request) => (
                    <div key={request.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getStatusIcon(request.status)}</span>
                            <h4 className="font-semibold text-gray-800">
                              {request.areaName}
                            </h4>
                            <span className="text-sm text-gray-500">ID: {request.areaId}</span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Motivo:</strong> {getReasonText(request.reason)}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Solicitante:</strong> {request.requestedBy}
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Data:</strong> {new Date(request.createdAt).toLocaleString('pt-BR')}
                          </div>

                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Justificativa:</strong> {request.justification}
                          </div>

                          {request.reviewNotes && (
                            <div className="text-sm bg-gray-50 p-2 rounded border">
                              <strong>Observações da Análise:</strong> {request.reviewNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {request.status === 'PENDING' && (
                        <div className="border-t pt-3 mt-3">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Observações da Análise (opcional)
                            </label>
                            <textarea
                              value={reviewNotes[request.id] || ''}
                              onChange={(e) => setReviewNotes(prev => ({
                                ...prev,
                                [request.id]: e.target.value
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="2"
                              placeholder="Comentários sobre a análise da solicitação..."
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveRemoval(request.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              ✅ Aprovar Remoção
                            </button>
                            <button
                              onClick={() => handleRejectRemoval(request.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                              ❌ Rejeitar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(selectedTab.startsWith('submission') || selectedTab === 'submissions') && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Solicitações de Adição ({filteredSubmissions.length})
                </h3>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">➕</div>
                  <p>Nenhuma solicitação de adição encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getStatusIcon(submission.status)}</span>
                            <span className="text-lg">{getSubmissionTypeIcon(submission.submissionType)}</span>
                            <h4 className="font-semibold text-gray-800">
                              {submission.areaName}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(submission.riskLevel)}`}>
                              {submission.riskLevel}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Tipo:</strong> {getSubmissionTypeText(submission.submissionType)}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Descrição:</strong> {submission.description}
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Data:</strong> {new Date(submission.submittedAt).toLocaleString('pt-BR')}
                          </div>

                          <div className="text-sm text-gray-600 mb-3">
                            <strong>População Afetada:</strong> {submission.affectedPopulation || 'Não informado'} pessoas
                          </div>

                          {submission.reviewNotes && (
                            <div className="text-sm bg-gray-50 p-2 rounded border">
                              <strong>Observações da Análise:</strong> {submission.reviewNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {submission.status === 'PENDING' && (
                        <div className="border-t pt-3 mt-3">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Observações da Análise (opcional)
                            </label>
                            <textarea
                              value={reviewNotes[submission.id] || ''}
                              onChange={(e) => setReviewNotes(prev => ({
                                ...prev,
                                [submission.id]: e.target.value
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="2"
                              placeholder="Comentários sobre a análise da solicitação..."
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveSubmission(submission.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              ✅ Aprovar Adição
                            </button>
                            <button
                              onClick={() => handleRejectSubmission(submission.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                              ❌ Rejeitar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RequestManagementModal;
