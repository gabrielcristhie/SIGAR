import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';
import VotingWarningModal from './VotingWarningModal';

const RequestManagementModal = ({ isOpen, onClose }) => {
  const { 
    removalRequests, 
    userSubmissions, 
    approveRemovalRequest, 
    rejectRemovalRequest,
    approveSubmission,
    rejectSubmission,
    getRemovalRequestStats,
    getSubmissionStats,
    getAreasOrderedByRequests,
    submitVote,
    user,
    isAuthenticated
  } = useAppStore();
  
  const [selectedTab, setSelectedTab] = useState('areas');
  const [reviewNotes, setReviewNotes] = useState({});
  const [isVotingWarningOpen, setIsVotingWarningOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);
  
  const removalStats = getRemovalRequestStats();
  const submissionStats = getSubmissionStats();
  const areasOrderedByRequests = getAreasOrderedByRequests();

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

  // Funções de Votação Pública
  const handlePublicVote = (requestId, requestType, voteType, requestData) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para votar.');
      return;
    }

    // Configurar voto pendente e abrir modal de aviso
    setPendingVote({ requestId, requestType, voteType, requestData });
    setIsVotingWarningOpen(true);
  };

  const confirmVote = () => {
    if (pendingVote) {
      const justification = reviewNotes[`vote-${pendingVote.requestId}`] || '';
      if (!justification.trim()) {
        alert('Por favor, forneça uma justificativa para seu voto.');
        return;
      }

      submitVote(
        pendingVote.requestId,
        pendingVote.requestType,
        pendingVote.voteType,
        justification
      );

      // Limpar estado
      setPendingVote(null);
      setReviewNotes(prev => ({ ...prev, [`vote-${pendingVote.requestId}`]: '' }));
      
      alert('Voto registrado com sucesso! Ele será validado pela equipe técnica.');
    }
  };

  const cancelVote = () => {
    setPendingVote(null);
    setIsVotingWarningOpen(false);
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
              <div className="text-2xl font-bold text-blue-600">{areasOrderedByRequests.length}</div>
              <div className="text-sm text-gray-600">Áreas Monitoradas</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-3 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTab('areas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'areas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏢 Áreas por Solicitações ({areasOrderedByRequests.length})
            </button>
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
          {selectedTab === 'areas' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Áreas Ordenadas por Quantidade de Solicitações
                </h3>
                <div className="text-sm text-gray-600">
                  Total: {areasOrderedByRequests.length} áreas
                </div>
              </div>

              {areasOrderedByRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">🏢</div>
                  <p>Nenhuma área encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {areasOrderedByRequests.map((area) => (
                    <div key={area.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {area.nome}
                            </h4>
                            <span className="text-sm text-gray-600">
                              (ID: {area.id})
                            </span>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              area.nivelAmeaca?.toLowerCase() === 'alto' 
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : area.nivelAmeaca?.toLowerCase() === 'médio'
                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {area.nivelAmeaca} Risco
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <strong>Município:</strong> {area.municipio}
                            </div>
                            <div>
                              <strong>Bairro:</strong> {area.bairro}
                            </div>
                            <div>
                              <strong>Tipo de Risco:</strong> {area.tipoRisco}
                            </div>
                            <div>
                              <strong>Responsável:</strong> {area.responsavelDC}
                            </div>
                          </div>

                          {area.descricao && (
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                              {area.descricao}
                            </p>
                          )}

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Detalhes das Solicitações:
                            </h5>
                            <div className="space-y-2 text-sm">
                              {area.removalRequests.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                  <span>
                                    {area.removalRequests.length} solicitação(ões) de remoção
                                  </span>
                                </div>
                              )}
                              {area.additionRequests.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                  <span>
                                    {area.additionRequests.length} solicitação(ões) de adição/modificação
                                  </span>
                                </div>
                              )}
                              {area.requestCount === 0 && (
                                <div className="flex items-center gap-2 text-gray-500">
                                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                                  <span>Nenhuma solicitação registrada</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <div className={`text-center p-3 rounded-lg ${
                            area.requestCount > 5 
                              ? 'bg-red-100 border border-red-200'
                              : area.requestCount > 2
                              ? 'bg-orange-100 border border-orange-200'
                              : area.requestCount > 0
                              ? 'bg-yellow-100 border border-yellow-200'
                              : 'bg-gray-100 border border-gray-200'
                          }`}>
                            <div className={`text-2xl font-bold ${
                              area.requestCount > 5 
                                ? 'text-red-700'
                                : area.requestCount > 2
                                ? 'text-orange-700'
                                : area.requestCount > 0
                                ? 'text-yellow-700'
                                : 'text-gray-500'
                            }`}>
                              {area.requestCount}
                            </div>
                            <div className="text-xs font-medium text-gray-600">
                              {area.requestCount === 1 ? 'Solicitação' : 'Solicitações'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {area.requestCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                          <button
                            onClick={() => setSelectedTab('removal_requests')}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Ver Solicitações
                          </button>
                          <button
                            onClick={() => console.log('Ver área no mapa:', area.id)}
                            className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                          >
                            Ver no Mapa
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          {selectedTab === 'public_voting' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Votação Pública - Solicitações Pendentes
                </h3>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-purple-500 text-xl">🗳️</div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Participação Democrática</h4>
                    <p className="text-purple-700 text-sm mt-1">
                      Contribua com a análise técnica votando nas solicitações. Votos mal-intencionados resultam em penalização.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">🗑️ Solicitações de Remoção</h4>
                {removalRequests.filter(req => req.status === 'PENDING').map((request) => (
                  <div key={`vote-removal-${request.id}`} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🗑️</span>
                          <h5 className="font-semibold text-gray-800">{request.areaName}</h5>
                          <span className="text-sm text-gray-500">ID: {request.areaId}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Motivo:</strong> {getReasonText(request.reason)}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Justificativa:</strong> {request.justification}
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Justificativa do seu voto (obrigatória)
                          </label>
                          <textarea
                            value={reviewNotes[`vote-${request.id}`] || ''}
                            onChange={(e) => setReviewNotes(prev => ({
                              ...prev,
                              [`vote-${request.id}`]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows="2"
                            placeholder="Explique tecnicamente por que você concorda ou discorda desta solicitação..."
                          />
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePublicVote(
                              request.id, 
                              'REMOVAL', 
                              'APPROVE',
                              { type: 'REMOVAL', areaName: request.areaName, areaId: request.areaId }
                            )}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            👍 Concordo com Remoção
                          </button>
                          <button
                            onClick={() => handlePublicVote(
                              request.id, 
                              'REMOVAL', 
                              'REJECT',
                              { type: 'REMOVAL', areaName: request.areaName, areaId: request.areaId }
                            )}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            👎 Discordo da Remoção
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <h4 className="font-medium text-gray-700 mt-6">➕ Solicitações de Adição</h4>
                {userSubmissions.filter(sub => sub.status === 'PENDING').map((submission) => (
                  <div key={`vote-submission-${submission.id}`} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">➕</span>
                          <h5 className="font-semibold text-gray-800">{submission.areaName}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(submission.riskLevel)}`}>
                            {submission.riskLevel}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Descrição:</strong> {submission.description}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>População Afetada:</strong> {submission.affectedPopulation || 'Não informado'} pessoas
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Justificativa do seu voto (obrigatória)
                          </label>
                          <textarea
                            value={reviewNotes[`vote-${submission.id}`] || ''}
                            onChange={(e) => setReviewNotes(prev => ({
                              ...prev,
                              [`vote-${submission.id}`]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows="2"
                            placeholder="Explique tecnicamente por que você concorda ou discorda desta submissão..."
                          />
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePublicVote(
                              submission.id, 
                              'SUBMISSION', 
                              'APPROVE',
                              { type: 'SUBMISSION', areaName: submission.areaName, areaId: submission.areaId }
                            )}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            👍 Concordo com Adição
                          </button>
                          <button
                            onClick={() => handlePublicVote(
                              submission.id, 
                              'SUBMISSION', 
                              'REJECT',
                              { type: 'SUBMISSION', areaName: submission.areaName, areaId: submission.areaId }
                            )}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            👎 Discordo da Adição
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(removalRequests.filter(req => req.status === 'PENDING').length === 0 && 
                  userSubmissions.filter(sub => sub.status === 'PENDING').length === 0) && (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-4xl mb-4">🗳️</div>
                    <p>Nenhuma solicitação pendente para votação no momento</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <VotingWarningModal
          isOpen={isVotingWarningOpen}
          onClose={cancelVote}
          onConfirm={confirmVote}
          requestData={pendingVote?.requestData}
        />
      </div>
    </div>,
    document.body
  );
};

export default RequestManagementModal;
