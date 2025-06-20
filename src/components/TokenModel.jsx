import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';
import WithdrawModal from './WithdrawModal';

const TokenModal = ({ isOpen, onClose }) => {
  const { 
    userTokens, 
    userSubmissions, 
    removalRequests, 
    getUserStats, 
    updateSubmissionStatus, 
    getRemovalRequestStats,
    getWithdrawableAmount,
    canWithdraw,
    COIN_VALUE
  } = useAppStore();
  
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  const stats = getUserStats();
  const removalStats = getRemovalRequestStats();
  const withdrawableAmount = getWithdrawableAmount();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'PENDING': return '⏳';
      default: return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED': return 'Aprovada';
      case 'REJECTED': return 'Rejeitada';
      case 'PENDING': return 'Em Análise';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const simulateReview = (submissionId, action) => {
    const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
    const notes = action === 'approve' 
      ? 'Área verificada e confirmada pela equipe técnica.' 
      : 'Área não atende aos critérios de risco estabelecidos.';
    
    updateSubmissionStatus(submissionId, status, notes);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🪙</div>
                <div>
                  <h2 className="text-2xl font-bold">SIGAR Coins</h2>
                  <p className="text-yellow-100">Sistema de Recompensas por Contribuições</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-yellow-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.totalTokens}</div>
                <div className="text-sm text-yellow-700">Total de SIGAR Coins</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSubmissions}</div>
                <div className="text-sm text-blue-700">Áreas Submetidas</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approvedSubmissions}</div>
                <div className="text-sm text-green-700">Áreas Aprovadas</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pendingSubmissions}</div>
                <div className="text-sm text-orange-700">Em Análise</div>
              </div>
            </div>

            <div className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">💸 Sacar SIGAR Coins</h3>
                <div className="text-sm text-green-700">
                  1 SIGAR Coin = R$ {COIN_VALUE.toFixed(2)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userTokens}</div>
                  <div className="text-sm text-green-700">Coins Disponíveis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">R$ {withdrawableAmount.toFixed(2)}</div>
                  <div className="text-sm text-green-700">Valor Convertido</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  disabled={!canWithdraw()}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    canWithdraw()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canWithdraw() ? '💰 Sacar Coins' : '🚫 Saque Indisponível'}
                </button>
              </div>
              
              {!canWithdraw() && (
                <div className="mt-2 text-xs text-gray-600 text-center">
                  Mínimo de 20 SIGAR Coins para saque
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">💰 Sistema de Recompensas</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>📍 Nova submissão de área:</span>
                    <span className="font-semibold text-yellow-600">+5 coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✅ Área aprovada por técnico:</span>
                    <span className="font-semibold text-green-600">+20 coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚨 Área crítica aprovada:</span>
                    <span className="font-semibold text-red-600">+50 coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🏆 Participação mensal ativa:</span>
                    <span className="font-semibold text-blue-600">+10 coins</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">📋 Suas Submissões</h3>
              {userSubmissions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📍</div>
                  <p>Nenhuma submissão de área realizada ainda.</p>
                  <p className="text-sm mt-1">Comece submetendo áreas de risco para ganhar SIGAR Coins!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getStatusIcon(submission.status)}</span>
                            <h4 className="font-semibold text-gray-800">{submission.areaName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                              {getStatusText(submission.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{submission.description}</p>
                          <div className="text-xs text-gray-500">
                            Submetido em: {new Date(submission.submittedAt).toLocaleString('pt-BR')}
                          </div>
                          {submission.reviewNotes && (
                            <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                              <strong>Observações:</strong> {submission.reviewNotes}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-600">+{submission.tokensEarned}</div>
                          <div className="text-xs text-gray-500">SIGAR Coins</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {removalStats.total > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">🗑️ Solicitações de Remoção</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{removalStats.total}</div>
                    <div className="text-sm text-purple-700">Total Solicitado</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{removalStats.approved}</div>
                    <div className="text-sm text-green-700">Aprovadas</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{removalStats.pending}</div>
                    <div className="text-sm text-orange-700">Pendentes</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> Áreas de alto risco aprovadas rendem mais coins!
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
      
      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
      />
    </>,
    document.body
  );
};

export default TokenModal;
