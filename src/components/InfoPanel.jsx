import React, { useState } from 'react';
import useAppStore from '../stores/useAppStore';
import EditarAreaModal from './EditarAreaModal';
import RemovalRequestModal from './RemovalRequestModal';
import VotingWarningModal from './VotingWarningModal';

const InfoPanel = () => {
  const { 
    isInfoPanelOpen, 
    getSelectedArea, 
    toggleInfoPanel, 
    isAuthenticated,
    submitVote,
    user 
  } = useAppStore();
  const selectedArea = getSelectedArea();
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);
  const [isVotingWarningOpen, setIsVotingWarningOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);
  const [voteJustification, setVoteJustification] = useState('');

  const formatField = (label, value) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || String(value).trim() === "") {
      return (
        <p>
          <strong className="text-gray-900">{label}:</strong> 
          <em className="text-gray-500"> Não informado</em>
        </p>
      );
    }
    return (
      <p>
        <strong className="text-gray-900">{label}:</strong> {value}
      </p>
    );
  };

  const handleClose = () => {
    toggleInfoPanel(false);
  };

  const handleEditArea = () => {
    console.log('🖊️ Botão editar clicado. Autenticado:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ Abrindo modal de edição do InfoPanel');
      setIsEditarModalOpen(true);
    } else {
      console.log('❌ Usuário não autenticado');
      alert('Faça login para editar áreas de risco.');
    }
  };

  const handleRequestRemoval = () => {
    console.log('🗑️ Botão remoção clicado. Autenticado:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ Abrindo modal de solicitação de remoção');
      setIsRemovalModalOpen(true);
    } else {
      console.log('❌ Usuário não autenticado');
      alert('Faça login para solicitar remoção de áreas de risco.');
    }
  };

  const handleVotePositive = () => {
    if (!isAuthenticated) {
      alert('Faça login para votar nas áreas de risco.');
      return;
    }
    handleVote('POSITIVE');
  };

  const handleVoteNegative = () => {
    if (!isAuthenticated) {
      alert('Faça login para votar nas áreas de risco.');
      return;
    }
    handleVote('NEGATIVE');
  };

  const handleVote = (voteType) => {
    console.log('🗳️ Iniciando votação:', voteType, 'para área:', selectedArea?.id);
    
    setPendingVote({
      areaId: selectedArea.id,
      voteType: voteType,
      requestData: {
        type: 'AREA_CLASSIFICATION',
        areaName: selectedArea.nome,
        areaId: selectedArea.id,
        riskLevel: selectedArea.nivelAmeaca
      }
    });
    setIsVotingWarningOpen(true);
  };

  const confirmVote = () => {
    if (pendingVote && voteJustification.trim()) {
      console.log('✅ Confirmando voto:', pendingVote);
      
      submitVote(
        pendingVote.areaId,
        'AREA_CLASSIFICATION',
        pendingVote.voteType,
        voteJustification.trim()
      );

      setPendingVote(null);
      setVoteJustification('');
      setIsVotingWarningOpen(false);
      
      alert(`Voto ${pendingVote.voteType === 'POSITIVE' ? 'positivo' : 'negativo'} registrado com sucesso!\nEle será validado pela equipe técnica.`);
    } else {
      alert('Por favor, forneça uma justificativa técnica para seu voto.');
    }
  };

  const cancelVote = () => {
    setPendingVote(null);
    setVoteJustification('');
    setIsVotingWarningOpen(false);
  };

  if (!selectedArea || !isInfoPanelOpen) return null;

  return (
    <aside className={`bg-white w-96 flex-shrink-0 p-6 shadow-xl fixed right-0 transform ${isInfoPanelOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30 overflow-y-auto border-l-2 border-gray-200`} style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Detalhes: {selectedArea.nome} ({selectedArea.id})
        </h2>
        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <>
              <button 
                onClick={handleEditArea}
                className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                title="Editar área"
              >
                <i className="fas fa-edit text-lg"></i>
              </button>
              <button 
                onClick={handleRequestRemoval}
                className="text-red-600 hover:text-red-800 transition-colors p-1"
                title="Solicitar remoção"
              >
                <i className="fas fa-trash-alt text-lg"></i>
              </button>
              
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              <button 
                onClick={handleVotePositive}
                className="text-green-600 hover:text-green-800 transition-colors p-1"
                title="Votar Positivamente - Concordo com a classificação desta área"
              >
                <i className="fas fa-thumbs-up text-lg"></i>
              </button>
              <button 
                onClick={handleVoteNegative}
                className="text-red-600 hover:text-red-800 transition-colors p-1"
                title="Votar Negativamente - Discordo da classificação desta área"
              >
                <i className="fas fa-thumbs-down text-lg"></i>
              </button>
            </>
          )}
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-900">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>
      </div>
      {isInfoPanelOpen && (
        <div className="space-y-3 text-sm text-gray-700 max-h-[calc(100%-60px)] overflow-y-auto pr-2">
          <div className={`p-3 rounded-lg border ${selectedArea.corNivelTailwind || 'border-gray-300'} mb-4`}>
            <p className="font-semibold text-lg">
              {selectedArea.tipoRisco || <em className="text-gray-500">Não informado</em>}
            </p>
            <p>
              <strong className="text-gray-900">Nível de Ameaça:</strong> 
              {selectedArea.nivelAmeaca || <em className="text-gray-500">Não informado</em>}
            </p>
          </div>
          
          <div className="space-y-2">
            {formatField("Município", selectedArea.municipio)}
            {formatField("Bairro/Localidade", selectedArea.bairro)}
            {formatField("Responsável DC", selectedArea.responsavelDC)}
            {formatField("Data Cadastro", selectedArea.dataCadastro)}
            {formatField("Última Atualização", selectedArea.ultimaAtualizacao)}
            {formatField("Coordenada Latitude", selectedArea.latitude)}
            {formatField("Coordenada Longitude", selectedArea.longitude)}
            {formatField("Área (m²)", selectedArea.area)}
            {formatField("Altimetria", selectedArea.altimetria)}
            {formatField("Tipo de Solo", selectedArea.tipoSolo)}
            {formatField("Uso do Solo", selectedArea.usoSolo)}
            {formatField("Situação Legal", selectedArea.situacaoLegal)}
            
            <hr className="my-3" />
            <h3 className="font-semibold text-md text-gray-900 mt-3">Descrição Detalhada</h3>
            <p className="text-justify">
              {selectedArea.descricao || <em className="text-gray-500">Não informado</em>}
            </p>
            
            <h3 className="font-semibold text-md text-gray-900 mt-3">Fatores Condicionantes</h3>
            {formatField("Naturais", selectedArea.fatoresNaturais)}
            {formatField("Antrópicos", selectedArea.fatoresAntropicos)}
            
            <h3 className="font-semibold text-md text-gray-900 mt-3">Evidências de Instabilidade</h3>
            <p>{selectedArea.evidencias || <em className="text-gray-500">Não informado</em>}</p>
            
            <hr className="my-3" />
            <h3 className="font-semibold text-md text-gray-900 mt-3">Impactos e Vulnerabilidades</h3>
            {formatField("População Exposta", selectedArea.populacaoExposta)}
            {formatField("Edificações Expostas", selectedArea.edificacoesExpostas)}
            {formatField("Infraestrutura Crítica", selectedArea.infraestruturaExposta)}
            
            <hr className="my-3" />
            <h3 className="font-semibold text-md text-gray-900 mt-3">Histórico de Incidentes</h3>
            {selectedArea.historicoIncidentes && selectedArea.historicoIncidentes.length > 0 ? (
              <ul className="list-disc list-inside pl-2 space-y-1">
                {selectedArea.historicoIncidentes.map((inc, index) => (
                  <li key={index}>
                    <strong>{inc.data}:</strong> {inc.descricao}
                  </li>
                ))}
              </ul>
            ) : (
              <p><em className="text-gray-500">Nenhum incidente registrado.</em></p>
            )}
            
            <hr className="my-3" />
            <h3 className="font-semibold text-md text-gray-900 mt-3">Monitoramento e Ações</h3>
            {formatField("Ações Mitigadoras Existentes", selectedArea.acoesMitigadoras)}
            {formatField("Medidas Preventivas Recomendadas", selectedArea.medidasRecomendadas)}
            {formatField("Status do Monitoramento", selectedArea.statusMonitoramento)}
            
            <hr className="my-3" />
            <h3 className="font-semibold text-md text-gray-900 mt-3">Anexos</h3>
            {selectedArea.anexos && selectedArea.anexos.length > 0 ? (
              <ul className="list-disc list-inside pl-2 space-y-1">
                {selectedArea.anexos.map((anx, index) => (
                  <li key={index}>
                    <a href={anx.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {anx.nome} <i className="fas fa-external-link-alt text-xs"></i>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p><em className="text-gray-500">Nenhum anexo disponível.</em></p>
            )}
          </div>
        </div>
      )}
      
      <EditarAreaModal 
        isOpen={isEditarModalOpen} 
        onClose={() => setIsEditarModalOpen(false)}
        areaToEdit={selectedArea}
      />
      <RemovalRequestModal
        isOpen={isRemovalModalOpen}
        onClose={() => setIsRemovalModalOpen(false)}
        areaToRemove={selectedArea}
      />
      
      <VotingWarningModal
        isOpen={isVotingWarningOpen}
        onClose={cancelVote}
        onConfirm={confirmVote}
        requestData={pendingVote?.requestData}
      />
    </aside>
  );
};

export default InfoPanel;
