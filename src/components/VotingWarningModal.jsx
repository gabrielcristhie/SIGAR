import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const VotingWarningModal = ({ isOpen, onClose, onConfirm, requestData }) => {
  const [understood, setUnderstood] = useState(false);

  const handleConfirm = () => {
    if (understood) {
      onConfirm();
      onClose();
    }
  };

  const handleClose = () => {
    setUnderstood(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                ⚠️ Aviso: Votação Responsável
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                Leia atentamente antes de continuar
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-orange-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-red-500 text-2xl">🚨</div>
              <div>
                <h3 className="font-bold text-red-800 text-lg">IMPORTANTE: Sistema de Penalização</h3>
                <p className="text-red-700 mt-2">
                  Votos comprovadamente mal-intencionados ou que visem atrapalhar o controle de áreas de risco 
                  resultarão em <strong>penalização de SIGAR Coins</strong>.
                </p>
              </div>
            </div>
          </div>

          {requestData && (
            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Você está votando sobre:</h4>
              <div className="text-sm text-gray-700">
                <p><strong>Tipo:</strong> {
                  requestData.type === 'REMOVAL' ? 'Solicitação de Remoção' : 
                  requestData.type === 'SUBMISSION' ? 'Solicitação de Adição' :
                  requestData.type === 'AREA_CLASSIFICATION' ? 'Classificação de Área de Risco' :
                  'Votação Pública'
                }</p>
                <p><strong>Área:</strong> {requestData.areaName}</p>
                <p><strong>ID:</strong> {requestData.areaId}</p>
                {requestData.riskLevel && (
                  <p><strong>Nível de Risco:</strong> {requestData.riskLevel}</p>
                )}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-3">💰 Penalizações por Conduta Inadequada:</h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-center">
                <span className="text-red-500 mr-2">-15</span>
                <span><strong>Voto Mal-Intencionado:</strong> Votar contra evidências técnicas claras</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">-25</span>
                <span><strong>Submissão Falsa:</strong> Cadastrar áreas inexistentes ou incorretas</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">-10</span>
                <span><strong>Denúncias Spam:</strong> Relatórios repetitivos sem fundamento</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">-50</span>
                <span><strong>Reincidência:</strong> Múltiplas infrações comprovadas</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-3">🔍 Como Funciona a Validação:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Seu voto é registrado no sistema</li>
              <li>Especialistas da Defesa Civil analisam tecnicamente a solicitação</li>
              <li>Seu voto é comparado com a análise técnica oficial</li>
              <li>Se houver divergência significativa sem justificativa válida, penalização é aplicada</li>
              <li>Você será notificado sobre o resultado da validação</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-3">✅ Dicas para Votação Responsável:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-700">
              <li>Analise cuidadosamente as evidências apresentadas</li>
              <li>Considere aspectos técnicos: geologia, hidrologia, ocupação do solo</li>
              <li>Vote baseado em conhecimento técnico, não em preferências pessoais</li>
              <li>Se não tem certeza, abstenha-se ou procure mais informações</li>
              <li>Lembre-se: sua votação afeta a segurança da população</li>
            </ul>
          </div>

          <div className="bg-gray-100 border rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                <strong>Declaro que:</strong> Li e compreendi as regras de votação responsável. 
                Entendo que votos mal-intencionados resultarão em penalização de SIGAR Coins. 
                Comprometo-me a votar com base em critérios técnicos e no interesse da segurança pública.
              </span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!understood}
            className={`px-6 py-2 rounded-md transition-colors ${
              understood
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Prosseguir com Votação
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VotingWarningModal;
