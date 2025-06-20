import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const RoadmapModal = ({ isOpen, onClose }) => {
  const {
    inspectionRoadmaps,
    createInspectionRoadmap,
    updateAreaInspection,
    getRoadmapStats,
    getAreasForInspection,
    loadExampleRoadmaps,
    riskAreas
  } = useAppStore();

  useEffect(() => {
    if (isOpen && (!inspectionRoadmaps || inspectionRoadmaps.length === 0)) {
      console.log('🎯 Modal aberto sem dados - carregando exemplos...');
      loadExampleRoadmaps();
    }
  }, [isOpen, inspectionRoadmaps, loadExampleRoadmaps]);

  const [activeTab, setActiveTab] = useState('roadmaps');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [roadmapForm, setRoadmapForm] = useState({
    title: '',
    description: '',
    inspector: '',
    priority: 'MEDIUM',
    estimatedDays: 3
  });
  const [inspectionForm, setInspectionForm] = useState({
    roadmapId: '',
    areaId: '',
    status: 'COMPLETED',
    findings: '',
    recommendations: '',
    riskLevel: '',
    inspector: ''
  });

  const stats = getRoadmapStats();
  const areasForInspection = getAreasForInspection();

  const handleCreateRoadmap = () => {
    if (!roadmapForm.title.trim() || selectedAreas.length === 0) {
      alert('Preencha o título e selecione pelo menos uma área');
      return;
    }

    const roadmapData = {
      ...roadmapForm,
      areas: selectedAreas.map(areaId => {
        const area = riskAreas[areaId];
        return {
          id: area.id,
          name: area.nome,
          municipality: area.municipio,
          neighborhood: area.bairro,
          riskType: area.tipoRisco,
          riskLevel: area.nivelAmeaca,
          coordinates: area.coordenadas ? area.coordenadas[0] : null
        };
      })
    };

    createInspectionRoadmap(roadmapData);
    
    setRoadmapForm({
      title: '',
      description: '',
      inspector: '',
      priority: 'MEDIUM',
      estimatedDays: 3
    });
    setSelectedAreas([]);
    setIsCreating(false);
    alert('Roadmap de vistoria criado com sucesso!');
  };

  const handleAreaInspection = (roadmapId, areaId) => {
    if (!inspectionForm.findings.trim()) {
      alert('Preencha as observações da vistoria');
      return;
    }

    updateAreaInspection(roadmapId, areaId, {
      status: inspectionForm.status,
      findings: inspectionForm.findings,
      recommendations: inspectionForm.recommendations,
      riskLevel: inspectionForm.riskLevel,
      inspector: inspectionForm.inspector || 'Inspetor Atual'
    });

    setInspectionForm({
      roadmapId: '',
      areaId: '',
      status: 'COMPLETED',
      findings: '',
      recommendations: '',
      riskLevel: '',
      inspector: ''
    });

    alert('Vistoria registrada com sucesso!');
  };

  const toggleAreaSelection = (areaId) => {
    setSelectedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACTIVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Concluído';
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'ACTIVE': return 'Ativo';
      case 'PENDING': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🗺️ Roadmap de Vistorias</h2>
              <p className="text-blue-100 mt-1">Planejamento e controle de vistorias técnicas</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-blue-100">Total Roadmaps</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.active + stats.inProgress}</div>
              <div className="text-sm text-blue-100">Em Andamento</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalAreas}</div>
              <div className="text-sm text-blue-100">Áreas Planejadas</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.completedAreas}</div>
              <div className="text-sm text-blue-100">Áreas Vistoriadas</div>
            </div>
          </div>

          {stats.total === 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  loadExampleRoadmaps();
                  console.log('🎯 Dados de exemplo carregados pelo usuário');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-download mr-2"></i>
                Carregar Dados de Exemplo
              </button>
              <p className="text-sm text-blue-100 mt-2">
                Clique para carregar roadmaps de demonstração
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('roadmaps')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'roadmaps'
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              🗺️ Roadmaps ({inspectionRoadmaps.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              ➕ Criar Roadmap
            </button>
            <button
              onClick={() => setActiveTab('areas')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'areas'
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏢 Áreas Prioritárias ({areasForInspection.length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {activeTab === 'roadmaps' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Roadmaps de Vistoria
                </h3>
              </div>

              {inspectionRoadmaps.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-route text-4xl mb-4"></i>
                  <p>Nenhum roadmap criado ainda</p>
                  <p className="text-sm mt-1">Crie seu primeiro roadmap para organizar as vistorias</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inspectionRoadmaps.map((roadmap) => (
                    <div key={roadmap.id} className="bg-white border rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {roadmap.title}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(roadmap.status)}`}>
                              {getStatusText(roadmap.status)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(roadmap.priority)}`}>
                              {roadmap.priority === 'HIGH' ? 'Alta' : roadmap.priority === 'MEDIUM' ? 'Média' : 'Baixa'} Prioridade
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{roadmap.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div><strong>Inspetor:</strong> {roadmap.inspector}</div>
                            <div><strong>Criado em:</strong> {new Date(roadmap.createdAt).toLocaleDateString('pt-BR')}</div>
                            <div><strong>Estimativa:</strong> {roadmap.estimatedDays} dias</div>
                            <div><strong>Progresso:</strong> {roadmap.completedAreas}/{roadmap.totalAreas} áreas</div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-800 mb-3">Áreas do Roadmap:</h5>
                            <div className="space-y-2">
                              {roadmap.areas.map((area) => (
                                <div key={area.id} className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{area.name}</div>
                                    <div className="text-xs text-gray-500">
                                      ID: {area.id} {area.inspector ? `| Inspetor: ${area.inspector}` : ''}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(area.status)}`}>
                                      {getStatusText(area.status)}
                                    </span>
                                    {area.status === 'PENDING' && (
                                      <button
                                        onClick={() => {
                                          setInspectionForm({
                                            ...inspectionForm,
                                            roadmapId: roadmap.id,
                                            areaId: area.id
                                          });
                                          setActiveTab('inspect');
                                        }}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                      >
                                        Vistoriar
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Criar Novo Roadmap</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Roadmap
                    </label>
                    <input
                      type="text"
                      value={roadmapForm.title}
                      onChange={(e) => setRoadmapForm({...roadmapForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Vistoria Mensal - Setor Norte"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={roadmapForm.description}
                      onChange={(e) => setRoadmapForm({...roadmapForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Descreva o objetivo desta vistoria..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inspetor Responsável
                    </label>
                    <input
                      type="text"
                      value={roadmapForm.inspector}
                      onChange={(e) => setRoadmapForm({...roadmapForm, inspector: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do inspetor"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridade
                      </label>
                      <select
                        value={roadmapForm.priority}
                        onChange={(e) => setRoadmapForm({...roadmapForm, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="LOW">Baixa</option>
                        <option value="MEDIUM">Média</option>
                        <option value="HIGH">Alta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prazo Estimado (dias)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={roadmapForm.estimatedDays}
                        onChange={(e) => setRoadmapForm({...roadmapForm, estimatedDays: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRoadmap}
                    disabled={!roadmapForm.title.trim() || selectedAreas.length === 0}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                      roadmapForm.title.trim() && selectedAreas.length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    🗺️ Criar Roadmap ({selectedAreas.length} áreas selecionadas)
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Áreas para Vistoria
                  </label>
                  <div className="border border-gray-300 rounded-md p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {areasForInspection.slice(0, 10).map((area) => (
                      <div key={area.id} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={selectedAreas.includes(area.id)}
                          onChange={() => toggleAreaSelection(area.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{area.nome}</div>
                          <div className="text-xs text-gray-500">
                            {area.municipio} - {area.bairro}
                          </div>
                          <div className="text-xs text-gray-600">
                            {area.tipoRisco} | {area.nivelAmeaca} Risco
                          </div>
                          <div className="text-xs text-orange-600">
                            Prioridade: {area.priority} | {area.requestCount} solicitações
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'areas' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Áreas Prioritárias para Vistoria
              </h3>
              <p className="text-gray-600">Áreas ordenadas por prioridade de vistoria baseada em risco, solicitações e última atualização.</p>
              
              <div className="space-y-3">
                {areasForInspection.map((area) => (
                  <div key={area.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{area.nome}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            area.nivelAmeaca?.toLowerCase() === 'alto' 
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : area.nivelAmeaca?.toLowerCase() === 'médio'
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {area.nivelAmeaca} Risco
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div><strong>Município:</strong> {area.municipio}</div>
                          <div><strong>Bairro:</strong> {area.bairro}</div>
                          <div><strong>Tipo:</strong> {area.tipoRisco}</div>
                          <div><strong>Última Vistoria:</strong> {area.lastInspection}</div>
                          <div><strong>Solicitações:</strong> {area.requestCount}</div>
                          <div><strong>Responsável:</strong> {area.responsavelDC}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          area.priority > 70 ? 'text-red-600' :
                          area.priority > 40 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {area.priority}
                        </div>
                        <div className="text-xs text-gray-500">Prioridade</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inspect' && inspectionForm.roadmapId && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Registrar Vistoria</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800">Área a ser vistoriada:</h4>
                {(() => {
                  const roadmap = inspectionRoadmaps.find(r => r.id === inspectionForm.roadmapId);
                  const area = roadmap?.areas.find(a => a.id === inspectionForm.areaId);
                  return area ? (
                    <div className="text-sm text-blue-700 mt-1">
                      {area.name} {area.municipality && area.neighborhood ? `- ${area.municipality}, ${area.neighborhood}` : ''}
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status da Vistoria
                  </label>
                  <select
                    value={inspectionForm.status}
                    onChange={(e) => setInspectionForm({...inspectionForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="COMPLETED">Concluída</option>
                    <option value="PENDING">Pendente (precisa retornar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações da Vistoria *
                  </label>
                  <textarea
                    value={inspectionForm.findings}
                    onChange={(e) => setInspectionForm({...inspectionForm, findings: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Descreva as condições encontradas na área..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recomendações
                  </label>
                  <textarea
                    value={inspectionForm.recommendations}
                    onChange={(e) => setInspectionForm({...inspectionForm, recommendations: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Recomendações para a área..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de Risco Atual
                    </label>
                    <select
                      value={inspectionForm.riskLevel}
                      onChange={(e) => setInspectionForm({...inspectionForm, riskLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Não alterado</option>
                      <option value="Alto">Alto Risco</option>
                      <option value="Médio">Médio Risco</option>
                      <option value="Baixo">Baixo Risco</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inspetor
                    </label>
                    <input
                      type="text"
                      value={inspectionForm.inspector}
                      onChange={(e) => setInspectionForm({...inspectionForm, inspector: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do inspetor"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAreaInspection(inspectionForm.roadmapId, inspectionForm.areaId)}
                    disabled={!inspectionForm.findings.trim()}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                      inspectionForm.findings.trim()
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    ✅ Registrar Vistoria
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('roadmaps')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RoadmapModal;
