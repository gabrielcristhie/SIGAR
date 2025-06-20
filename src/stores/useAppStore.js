import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { riskAreasData } from '../data/mockData';
import { apiService } from '../services/api';

const useAppStore = create(
  persist(
    (set, get) => ({
      riskAreas: riskAreasData,
      selectedAreaId: null,
      isInfoPanelOpen: false,
      
      isLoginModalOpen: false,
      loginActionTitle: '',
      
      loading: false,
      error: null,
      
      isAuthenticated: false,
      user: null,
      authToken: null,

      userTokens: 0,
      userSubmissions: [],
      isTokenModalOpen: false,
      
      isWithdrawModalOpen: false,
      withdrawHistory: [],
      
      COIN_VALUE: 0.50,
      MIN_WITHDRAWAL: 20,

      removalRequests: [],
      isRemovalModalOpen: false,

      userVotes: [],
      votingHistory: [],

      inspectionRoadmaps: [],
      isRoadmapModalOpen: false,

      tokenNotification: {
        show: false,
        tokens: 0,
        message: ''
      },

      TOKEN_REWARDS: {
        SUBMISSION: 5,
        APPROVED: 20,
        CRITICAL_AREA: 50,
        MONTHLY_ACTIVE: 10
      },

      TOKEN_PENALTIES: {
        BAD_FAITH_VOTE: -15,
        FALSE_SUBMISSION: -25,
        SPAM_REPORTS: -10,
        REPEATED_OFFENSE: -50
      },

      fetchRiskAreas: async () => {
        set({ loading: true, error: null });
        try {
          try {
            const response = await apiService.getRiskAreas();
            set({ riskAreas: response.data, loading: false });
          } catch (apiError) {
            if (import.meta.env.VITE_DEBUG_MODE === 'true') {
              console.info('🔄 Modo desenvolvimento: usando dados mockados (backend não conectado)');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            set({ riskAreas: riskAreasData, loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      selectArea: (areaId) => {
        console.log('🎯 Store: selectArea chamado com ID:', areaId);
        set({ 
          selectedAreaId: areaId
        });
        console.log('✅ Store: selectedAreaId definido como:', areaId);
      },

      toggleInfoPanel: (isOpen) => {
        set({ isInfoPanelOpen: isOpen });
        if (!isOpen) {
          set({ selectedAreaId: null });
        }
      },

      toggleLoginModal: (isOpen, actionTitle = '') => {
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
          console.log('🔐 Modal login:', isOpen ? 'ABRIR' : 'FECHAR', actionTitle);
        }
        set({ 
          isLoginModalOpen: isOpen,
          loginActionTitle: actionTitle 
        });
      },

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          try {
            const response = await apiService.login(credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('authToken', token);
            set({ 
              isAuthenticated: true,
              user,
              authToken: token,
              loading: false,
              isLoginModalOpen: false,
              loginActionTitle: ''
            });
            return { success: true };
          } catch (apiError) {
            if (import.meta.env.VITE_DEBUG_MODE === 'true') {
              console.info('🔐 Modo desenvolvimento: simulando login (backend não conectado)');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockUser = {
              id: 1,
              username: credentials.username,
              name: credentials.username === 'inspetor' ? 'Inspetor de Campo' : 'Usuário Simulado',
              role: credentials.username === 'inspetor' ? 'inspector' : 'admin',
              email: `${credentials.username}@sigar.go.gov.br`
            };
            
            const mockToken = 'mock-jwt-token-' + Date.now();
            localStorage.setItem('authToken', mockToken);
            
            const userData = get().loadUserData(credentials.username);
            
            set({ 
              isAuthenticated: true,
              user: mockUser,
              authToken: mockToken,
              loading: false,
              isLoginModalOpen: false,
              loginActionTitle: '',
              userTokens: userData.tokens,
              userSubmissions: userData.submissions,
              removalRequests: userData.removalRequests || []
            });
            return { success: true };
          }
        } catch (error) {
          set({ error: 'Erro ao fazer login. Verifique suas credenciais.', loading: false });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        try {
          await apiService.logout();
        } catch (error) {
          console.warn('Erro ao fazer logout na API:', error.message);
        }
        
        localStorage.removeItem('authToken');
        set({ 
          isAuthenticated: false,
          user: null,
          authToken: null 
        });
      },

      clearError: () => {
        set({ error: null });
      },

      getSelectedArea: () => {
        const { riskAreas, selectedAreaId } = get();
        if (!selectedAreaId) return null;
        const area = Object.values(riskAreas).find(area => area.id === selectedAreaId);
        console.log('🔍 Store: getSelectedArea', { selectedAreaId, area: area || 'não encontrada' });
        return area || null;
      },

      loadUserData: (username) => {
        if (username === 'demo' || username === 'admin' || username === 'inspetor') {
          return {
            tokens: 85,
            submissions: [
              {
                id: 'SUB-DEMO-001',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                description: 'Área com histórico de deslizamentos em períodos chuvosos intensos.',
                riskLevel: 'HIGH',
                affectedPopulation: 200,
                submissionType: 'NEW_AREA',
                status: 'APPROVED',
                submittedAt: '2025-06-10T10:00:00.000Z',
                tokensEarned: 75,
                reviewedAt: '2025-06-12T14:30:00.000Z',
                reviewedBy: 'Eng. Ana Silva',
                reviewNotes: 'Área confirmada após vistoria técnica. Alto risco de deslizamento confirmado.'
              },
              {
                id: 'SUB-DEMO-002',
                areaId: 'R-DEMO-002',
                areaName: 'Área Industrial - Setor Norte',
                description: 'Possível contaminação química no solo da área industrial.',
                riskLevel: 'MEDIUM',
                affectedPopulation: 50,
                submissionType: 'NEW_AREA',
                status: 'REJECTED',
                submittedAt: '2025-06-08T15:20:00.000Z',
                tokensEarned: 5,
                reviewedAt: '2025-06-09T09:15:00.000Z',
                reviewedBy: 'Téc. Carlos Santos',
                reviewNotes: 'Área não apresenta características de risco significativo após análise técnica.'
              },
              {
                id: 'SUB-DEMO-003',
                areaId: 'R-DEMO-003',
                areaName: 'Área Residencial - Vila Nova',
                description: 'Suspeita de instabilidade do solo em área residencial.',
                riskLevel: 'LOW',
                affectedPopulation: 150,
                submissionType: 'NEW_AREA',
                status: 'PENDING',
                submittedAt: '2025-06-15T08:45:00.000Z',
                tokensEarned: 5,
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: ''
              },
              {
                id: 'SUB-DEMO-004',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                description: 'Atualização de dados: Novas construções irregulares na área de risco.',
                riskLevel: 'HIGH',
                affectedPopulation: 250,
                submissionType: 'UPDATE_AREA',
                status: 'PENDING',
                submittedAt: '2025-06-18T16:15:00.000Z',
                tokensEarned: 5,
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: ''
              },
              {
                id: 'SUB-DEMO-005',
                areaId: 'R2-AP-015',
                areaName: 'Margem do Rio Meia Ponte',
                description: 'Relatório de erosão acelerada na margem do rio.',
                riskLevel: 'HIGH',
                affectedPopulation: 180,
                submissionType: 'UPDATE_AREA',
                status: 'PENDING',
                submittedAt: '2025-06-19T12:30:00.000Z',
                tokensEarned: 5,
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: ''
              },
              {
                id: 'SUB-DEMO-006',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                description: 'Monitoramento comunitário: Identificação de novas trincas no terreno.',
                riskLevel: 'HIGH',
                affectedPopulation: 200,
                submissionType: 'INCIDENT_REPORT',
                status: 'APPROVED',
                submittedAt: '2025-06-17T09:20:00.000Z',
                tokensEarned: 25,
                reviewedAt: '2025-06-18T11:45:00.000Z',
                reviewedBy: 'Geól. Roberto Lima',
                reviewNotes: 'Relatório confirmado. Trincas indicam agravamento da instabilidade.'
              },
              {
                id: 'SUB-DEMO-007',
                areaId: 'R2-AP-015',
                areaName: 'Margem do Rio Meia Ponte',
                description: 'Solicitação de reclassificação para Alto Risco devido a mudanças no leito do rio.',
                riskLevel: 'HIGH',
                affectedPopulation: 180,
                submissionType: 'RECLASSIFICATION',
                status: 'PENDING',
                submittedAt: '2025-06-20T08:10:00.000Z',
                tokensEarned: 5,
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: ''
              }
            ],
            removalRequests: [
              {
                id: 'REM-DEMO-001',
                areaId: 'R-OLD-001',
                areaName: 'Área Estabilizada - Centro',
                requestedBy: 'Usuário Demo',
                createdAt: '2025-06-14T10:00:00.000Z',
                reason: 'RISK_RESOLVED',
                justification: 'Área foi estabilizada após obras de contenção realizadas pela prefeitura.',
                status: 'APPROVED',
                reviewedAt: '2025-06-16T14:00:00.000Z',
                reviewedBy: 'Cap. João Santos - Defesa Civil',
                reviewNotes: 'Solicitação aprovada após vistoria técnica confirmar estabilização.',
                priority: 'MEDIUM'
              },
              {
                id: 'REM-DEMO-002',
                areaId: 'R2-GO-002',
                areaName: 'Encosta Sul - Bairro Esperança',
                requestedBy: 'Usuário Demo',
                createdAt: '2025-06-16T16:30:00.000Z',
                reason: 'INCORRECT_CLASSIFICATION',
                justification: 'Após nova análise, verificou-se que a área não apresenta características de risco significativo.',
                status: 'PENDING',
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: '',
                priority: 'HIGH'
              },
              {
                id: 'REM-DEMO-003',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                requestedBy: 'Maria Santos',
                createdAt: '2025-06-18T09:15:00.000Z',
                reason: 'SAFETY_CONCERN',
                justification: 'Moradores relatam aumento de trincas após últimas chuvas. Situação está se agravando rapidamente.',
                status: 'PENDING',
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: '',
                priority: 'HIGH'
              },
              {
                id: 'REM-DEMO-004',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                requestedBy: 'João Silva',
                createdAt: '2025-06-19T14:20:00.000Z',
                reason: 'IMMEDIATE_DANGER',
                justification: 'Casa nº 45 apresenta rachaduras severas na parede. Família evacuada preventivamente.',
                status: 'PENDING',
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: '',
                priority: 'HIGH'
              },
              {
                id: 'REM-DEMO-005',
                areaId: 'R2-AP-015',
                areaName: 'Margem do Rio Meia Ponte',
                requestedBy: 'Ana Costa',
                createdAt: '2025-06-17T11:40:00.000Z',
                reason: 'FLOODING_RISK',
                justification: 'Nível do rio subiu significativamente após chuvas. Várias casas com água no quintal.',
                status: 'PENDING',
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: '',
                priority: 'MEDIUM'
              },
              {
                id: 'REM-DEMO-006',
                areaId: 'R2-AP-015',
                areaName: 'Margem do Rio Meia Ponte',
                requestedBy: 'Carlos Oliveira',
                createdAt: '2025-06-19T08:30:00.000Z',
                reason: 'EROSION_CONCERN',
                justification: 'Erosão da margem está avançando em direção às casas. Já perdemos 2 metros de terreno.',
                status: 'PENDING',
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: '',
                priority: 'HIGH'
              },
              {
                id: 'REM-DEMO-007',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                requestedBy: 'Presidente Associação Moradores',
                createdAt: '2025-06-20T07:45:00.000Z',
                reason: 'COLLECTIVE_REQUEST',
                justification: 'Em nome de 35 famílias, solicitamos reavaliação urgente da área. Situação crítica após chuvas intensas.',
                status: 'PENDING',
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: '',
                priority: 'HIGH'
              }
            ]
          };
        }
        
        return {
          tokens: 0,
          submissions: [],
          removalRequests: []
        };
      },
      toggleTokenModal: (isOpen) => {
        set({ isTokenModalOpen: isOpen });
      },

      showTokenNotification: (tokens, message) => {
        set({
          tokenNotification: {
            show: true,
            tokens,
            message
          }
        });
      },

      hideTokenNotification: () => {
        set({
          tokenNotification: {
            show: false,
            tokens: 0,
            message: ''
          }
        });
      },

      addUserSubmission: (areaData, submissionType = 'NEW_AREA') => {
        const submission = {
          id: `SUB-${Date.now()}`,
          areaId: areaData.id,
          areaName: areaData.nome,
          submissionType,
          status: 'PENDING',
          submittedAt: new Date().toISOString(),
          tokensEarned: 0,
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: ''
        };

        const tokensGanhos = get().TOKEN_REWARDS.SUBMISSION;

        set(state => ({
          userSubmissions: [...state.userSubmissions, submission],
          userTokens: state.userTokens + tokensGanhos
        }));

        get().showTokenNotification(tokensGanhos, 'Área submetida com sucesso!');

        console.log('🎁 Tokens ganhos por submissão:', tokensGanhos);
        return submission;
      },

      updateSubmissionStatus: (submissionId, status, reviewNotes = '') => {
        set(state => {
          const updatedSubmissions = state.userSubmissions.map(sub => {
            if (sub.id === submissionId) {
              let tokensBonus = 0;
              if (status === 'APPROVED') {
                tokensBonus = state.TOKEN_REWARDS.APPROVED;
                const area = Object.values(state.riskAreas).find(area => area.id === sub.areaId);
                if (area && area.nivelAmeaca === 'Alto') {
                  tokensBonus += state.TOKEN_REWARDS.CRITICAL_AREA;
                }
              }

              return {
                ...sub,
                status,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'Sistema Técnico',
                reviewNotes,
                tokensEarned: sub.tokensEarned + tokensBonus
              };
            }
            return sub;
          });

          const totalBonusTokens = updatedSubmissions
            .filter(sub => sub.id === submissionId && sub.status === 'APPROVED')
            .reduce((sum, sub) => sum + (sub.tokensEarned - state.TOKEN_REWARDS.SUBMISSION), 0);

          return {
            userSubmissions: updatedSubmissions,
            userTokens: state.userTokens + totalBonusTokens
          };
        });
      },

      getUserStats: () => {
        const { userSubmissions, userTokens } = get();
        return {
          totalSubmissions: userSubmissions.length,
          approvedSubmissions: userSubmissions.filter(sub => sub.status === 'APPROVED').length,
          pendingSubmissions: userSubmissions.filter(sub => sub.status === 'PENDING').length,
          rejectedSubmissions: userSubmissions.filter(sub => sub.status === 'REJECTED').length,
          totalTokens: userTokens,
          avgTokensPerSubmission: userSubmissions.length > 0 ? (userTokens / userSubmissions.length).toFixed(1) : 0
        };
      },

      getSubmissionStats: () => {
        const { userSubmissions } = get();
        return {
          total: userSubmissions.length,
          pending: userSubmissions.filter(sub => sub.status === 'PENDING').length,
          approved: userSubmissions.filter(sub => sub.status === 'APPROVED').length,
          rejected: userSubmissions.filter(sub => sub.status === 'REJECTED').length
        };
      },

      approveSubmission: (submissionId, reviewNotes = '') => {
        console.log('✅ Aprovando solicitação de adição:', submissionId);
        set(state => {
          const updatedSubmissions = state.userSubmissions.map(sub => {
            if (sub.id === submissionId) {
              return {
                ...sub,
                status: 'APPROVED',
                reviewNotes,
                reviewedAt: new Date().toISOString(),
                tokensEarned: state.TOKEN_REWARDS.APPROVED
              };
            }
            return sub;
          });

          const bonusTokens = state.TOKEN_REWARDS.APPROVED;

          return {
            userSubmissions: updatedSubmissions,
            userTokens: state.userTokens + bonusTokens
          };
        });

        get().showTokenNotification(get().TOKEN_REWARDS.APPROVED, 'Solicitação aprovada!');
      },

      rejectSubmission: (submissionId, reviewNotes = '') => {
        console.log('❌ Rejeitando solicitação de adição:', submissionId);
        set(state => {
          const updatedSubmissions = state.userSubmissions.map(sub => {
            if (sub.id === submissionId) {
              return {
                ...sub,
                status: 'REJECTED',
                reviewNotes,
                reviewedAt: new Date().toISOString()
              };
            }
            return sub;
          });

          return {
            userSubmissions: updatedSubmissions
          };
        });
      },

      initialize: () => {
        const token = localStorage.getItem('authToken');
        if (token) {
          const mockUser = {
            id: 1,
            username: 'usuario.restaurado',
            name: 'Usuário Restaurado',
            role: 'admin',
            email: 'usuario@sigar.go.gov.br'
          };
          
          const userData = get().loadUserData('demo');
          
          set({ 
            isAuthenticated: true,
            user: mockUser,
            authToken: token,
            userTokens: userData.tokens,
            userSubmissions: userData.submissions,
            removalRequests: userData.removalRequests || []
          });
        }

        const currentState = get();
        if (!currentState.inspectionRoadmaps || currentState.inspectionRoadmaps.length === 0) {
          console.log('🚀 Inicializando dados de exemplo para roadmaps');
          get().loadExampleRoadmaps();
        }

        get().fetchRiskAreas();
      },

      addRiskArea: async (newArea) => {
        set({ loading: true, error: null });
        try {
          try {
            const response = await apiService.createRiskArea(newArea);
            const createdArea = response.data;
            
            set(state => {
              const keys = Object.keys(state.riskAreas).map(Number).filter(n => !isNaN(n));
              const nextKey = keys.length > 0 ? Math.max(...keys) + 1 : 1;
              return {
                riskAreas: { ...state.riskAreas, [nextKey]: createdArea },
                loading: false 
              };
            });
          } catch (apiError) {
            if (import.meta.env.VITE_DEBUG_MODE === 'true') {
              console.info('🔄 Modo desenvolvimento: adicionando área localmente (backend não conectado)');
            }
            await new Promise(resolve => setTimeout(resolve, 500));

            set(state => {
              const keys = Object.keys(state.riskAreas).map(Number).filter(n => !isNaN(n));
              const nextKey = keys.length > 0 ? Math.max(...keys) + 1 : 1;
              return {
                riskAreas: { ...state.riskAreas, [nextKey]: newArea },
                loading: false 
              };
            });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateRiskArea: async (areaId, updatedArea) => {
        console.log('🔄 Store: updateRiskArea chamado', { areaId, updatedArea });
        set({ loading: true, error: null });
        try {
          try {
            const response = await apiService.updateRiskArea(areaId, updatedArea);
            const updatedAreaFromAPI = response.data;
            
            set(state => {
              const key = Object.keys(state.riskAreas).find(key => state.riskAreas[key].id === areaId);
              if (key) {
                return {
                  riskAreas: { ...state.riskAreas, [key]: updatedAreaFromAPI },
                  loading: false 
                };
              }
              return { loading: false };
            });
            console.log('✅ Store: Área atualizada via API');
          } catch (apiError) {
            if (import.meta.env.VITE_DEBUG_MODE === 'true') {
              console.info('🔄 Modo desenvolvimento: atualizando área localmente (backend não conectado)');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => {
              const key = Object.keys(state.riskAreas).find(key => state.riskAreas[key].id === areaId);
              if (key) {
                return {
                  riskAreas: { ...state.riskAreas, [key]: updatedArea },
                  loading: false 
                };
              }
              return { loading: false };
            });
            console.log('✅ Store: Área atualizada localmente');
          }
        } catch (error) {
          console.error('❌ Store: Erro ao atualizar área:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      toggleRemovalModal: (isOpen) => {
        set({ isRemovalModalOpen: isOpen });
      },

      requestAreaRemoval: (areaId, reason, justification) => {
        const area = get().getSelectedArea();
        if (!area) return null;

        const removalRequest = {
          id: `REM-${Date.now()}`,
          areaId: areaId,
          areaName: area.nome,
          requestedBy: get().user?.name || 'Usuário',
          requestedAt: new Date().toISOString(),
          reason: reason,
          justification: justification,
          status: 'PENDING',
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: '',
          priority: area.nivelAmeaca === 'Alto' ? 'HIGH' : area.nivelAmeaca === 'Médio' ? 'MEDIUM' : 'LOW'
        };

        set(state => ({
          removalRequests: [...state.removalRequests, removalRequest]
        }));

        console.log('🗑️ Solicitação de remoção criada:', removalRequest);
        return removalRequest;
      },

      approveRemovalRequest: (requestId, reviewNotes = '') => {
        const { removalRequests, riskAreas } = get();
        const request = removalRequests.find(req => req.id === requestId);
        
        if (!request) return false;

        set(state => ({
          removalRequests: state.removalRequests.map(req => 
            req.id === requestId 
              ? {
                  ...req,
                  status: 'APPROVED',
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: 'Defesa Civil',
                  reviewNotes: reviewNotes || 'Remoção aprovada pela autoridade competente.'
                }
              : req
          )
        }));

        set(state => {
          const newRiskAreas = { ...state.riskAreas };
          const keyToRemove = Object.keys(newRiskAreas).find(key => 
            newRiskAreas[key].id === request.areaId
          );
          
          if (keyToRemove) {
            delete newRiskAreas[keyToRemove];
          }

          return {
            riskAreas: newRiskAreas,
            selectedAreaId: state.selectedAreaId === request.areaId ? null : state.selectedAreaId,
            isInfoPanelOpen: state.selectedAreaId === request.areaId ? false : state.isInfoPanelOpen
          };
        });

        console.log('✅ Área removida do sistema:', request.areaId);
        return true;
      },

      rejectRemovalRequest: (requestId, reviewNotes = '') => {
        set(state => ({
          removalRequests: state.removalRequests.map(req => 
            req.id === requestId 
              ? {
                  ...req,
                  status: 'REJECTED',
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: 'Defesa Civil',
                  reviewNotes: reviewNotes || 'Solicitação de remoção rejeitada.'
                }
              : req
          )
        }));

        console.log('❌ Solicitação de remoção rejeitada:', requestId);
        return true;
      },

      getRemovalRequestStats: () => {
        const { removalRequests } = get();
        return {
          total: removalRequests.length,
          pending: removalRequests.filter(req => req.status === 'PENDING').length,
          approved: removalRequests.filter(req => req.status === 'APPROVED').length,
          rejected: removalRequests.filter(req => req.status === 'REJECTED').length,
        };
      },

      submitVote: (requestId, requestType, voteType, justification) => {
        console.log('🗳️ Submetendo voto:', { requestId, requestType, voteType });
        
        const vote = {
          id: `VOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          requestId,
          requestType,
          voteType,
          justification,
          votedBy: get().user?.username || 'anonymous',
          votedAt: new Date().toISOString(),
          status: 'PENDING_REVIEW',
          validated: false,
          penaltyApplied: false
        };

        set(state => ({
          userVotes: [...state.userVotes, vote],
          votingHistory: [...state.votingHistory, vote]
        }));

        get().showVotingWarning();
        
        return vote;
      },

      validateVote: (voteId, isCorrect, adminNotes = '') => {
        console.log('✅ Validando voto:', voteId, 'Correto:', isCorrect);
        
        set(state => {
          const updatedVotes = state.userVotes.map(vote => {
            if (vote.id === voteId) {
              const updatedVote = {
                ...vote,
                validated: true,
                validatedAt: new Date().toISOString(),
                validatedBy: state.user?.username,
                isCorrect,
                adminNotes
              };

              if (!isCorrect && !vote.penaltyApplied) {
                const penalty = state.TOKEN_PENALTIES.BAD_FAITH_VOTE;
                const newTokens = Math.max(0, state.userTokens + penalty);
                
                console.log('⚠️ Aplicando penalização por voto mal-intencionado:', penalty);
                
                get().showTokenNotification(penalty, 'Penalização por voto mal-intencionado');
                
                return {
                  ...updatedVote,
                  penaltyApplied: true,
                  tokensDeducted: Math.abs(penalty)
                };
              }

              return updatedVote;
            }
            return vote;
          });

          const updatedHistory = state.votingHistory.map(vote => 
            vote.id === voteId ? updatedVotes.find(v => v.id === voteId) : vote
          );

          const penaltyVote = updatedVotes.find(v => v.id === voteId);
          const tokenAdjustment = penaltyVote && !penaltyVote.isCorrect && !state.userVotes.find(v => v.id === voteId)?.penaltyApplied
            ? state.TOKEN_PENALTIES.BAD_FAITH_VOTE
            : 0;

          return {
            userVotes: updatedVotes,
            votingHistory: updatedHistory,
            userTokens: tokenAdjustment !== 0 ? Math.max(0, state.userTokens + tokenAdjustment) : state.userTokens
          };
        });
      },

      getVotingStats: () => {
        const { userVotes } = get();
        return {
          totalVotes: userVotes.length,
          pendingVotes: userVotes.filter(vote => !vote.validated).length,
          correctVotes: userVotes.filter(vote => vote.validated && vote.isCorrect).length,
          incorrectVotes: userVotes.filter(vote => vote.validated && !vote.isCorrect).length,
          totalPenalties: userVotes
            .filter(vote => vote.penaltyApplied)
            .reduce((sum, vote) => sum + (vote.tokensDeducted || 0), 0)
        };
      },

      getAreasOrderedByRequests: () => {
        const { riskAreas, removalRequests, userSubmissions } = get();
        
        const areaCounts = {};
        
        removalRequests.forEach(request => {
          const areaId = request.areaId;
          areaCounts[areaId] = (areaCounts[areaId] || 0) + 1;
        });
        
        userSubmissions.forEach(submission => {
          if (submission.areaId) {
            const areaId = submission.areaId;
            areaCounts[areaId] = (areaCounts[areaId] || 0) + 1;
          }
        });
        
        const areasWithCounts = Object.values(riskAreas).map(area => ({
          ...area,
          requestCount: areaCounts[area.id] || 0,
          removalRequests: removalRequests.filter(req => req.areaId === area.id),
          additionRequests: userSubmissions.filter(sub => sub.areaId === area.id),
          totalRequests: (areaCounts[area.id] || 0)
        }));
        
        return areasWithCounts.sort((a, b) => b.requestCount - a.requestCount);
      },

      toggleWithdrawModal: (isOpen) => {
        set({ isWithdrawModalOpen: isOpen });
      },

      getWithdrawableAmount: () => {
        const { userTokens, COIN_VALUE } = get();
        return userTokens * COIN_VALUE;
      },

      canWithdraw: () => {
        const { userTokens, MIN_WITHDRAWAL } = get();
        return userTokens >= MIN_WITHDRAWAL;
      },

      processWithdrawal: (withdrawData) => {
        const { userTokens, withdrawHistory, COIN_VALUE } = get();
        const { coins, paymentMethod, accountInfo } = withdrawData;
        
        if (coins > userTokens) {
          throw new Error('Saldo insuficiente de SIGAR Coins');
        }
        
        if (coins < get().MIN_WITHDRAWAL) {
          throw new Error(`Saque mínimo de ${get().MIN_WITHDRAWAL} coins`);
        }

        const withdrawalAmount = coins * COIN_VALUE;
        
        const withdrawal = {
          id: `WITHDRAW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          coins,
          amount: withdrawalAmount,
          paymentMethod,
          accountInfo,
          status: 'PROCESSING',
          requestedAt: new Date().toISOString(),
          processedAt: null,
          userId: get().user?.id,
          username: get().user?.username
        };

        set(state => ({
          userTokens: state.userTokens - coins,
          withdrawHistory: [withdrawal, ...state.withdrawHistory],
          isWithdrawModalOpen: false
        }));

        setTimeout(() => {
          set(state => ({
            withdrawHistory: state.withdrawHistory.map(w => 
              w.id === withdrawal.id 
                ? { ...w, status: 'COMPLETED', processedAt: new Date().toISOString() }
                : w
            )
          }));
        }, 3000);

        return withdrawal;
      },

      getWithdrawHistory: () => {
        const { withdrawHistory } = get();
        return withdrawHistory.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
      },

      toggleRoadmapModal: (isOpen) => {
        set({ isRoadmapModalOpen: isOpen });
      },

      createInspectionRoadmap: (roadmapData) => {
        const roadmap = {
          id: `ROADMAP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...roadmapData,
          createdAt: new Date().toISOString(),
          createdBy: get().user?.username || 'admin',
          status: 'ACTIVE',
          areas: roadmapData.areas.map(area => ({
            ...area,
            status: 'PENDING',
            visitedAt: null,
            findings: null,
            inspector: null
          }))
        };

        set(state => ({
          inspectionRoadmaps: [roadmap, ...state.inspectionRoadmaps]
        }));

        return roadmap;
      },

      updateAreaInspection: (roadmapId, areaId, inspectionData) => {
        set(state => ({
          inspectionRoadmaps: state.inspectionRoadmaps.map(roadmap => {
            if (roadmap.id === roadmapId) {
              const updatedAreas = roadmap.areas.map(area => {
                if (area.id === areaId) {
                  return {
                    ...area,
                    ...inspectionData,
                    visitedAt: new Date().toISOString()
                  };
                }
                return area;
              });

              const completedAreasCount = updatedAreas.filter(area => area.status === 'COMPLETED').length;
              const newStatus = completedAreasCount === updatedAreas.length ? 'COMPLETED' : 'IN_PROGRESS';

              return {
                ...roadmap,
                areas: updatedAreas,
                status: newStatus,
                lastUpdated: new Date().toISOString()
              };
            }
            return roadmap;
          })
        }));
      },

      getRoadmapStats: () => {
        const { inspectionRoadmaps } = get();
        
        if (!inspectionRoadmaps || inspectionRoadmaps.length === 0) {
          return {
            total: 0,
            active: 0,
            inProgress: 0,
            completed: 0,
            totalAreas: 0,
            completedAreas: 0
          };
        }
        
        let totalAreas = 0;
        let completedAreas = 0;
        
        inspectionRoadmaps.forEach(roadmap => {
          if (roadmap.areas && Array.isArray(roadmap.areas)) {
            totalAreas += roadmap.areas.length;
            completedAreas += roadmap.areas.filter(area => area.status === 'COMPLETED').length;
          }
        });
        
        return {
          total: inspectionRoadmaps.length,
          active: inspectionRoadmaps.filter(r => r.status === 'ACTIVE').length,
          inProgress: inspectionRoadmaps.filter(r => r.status === 'IN_PROGRESS').length,
          completed: inspectionRoadmaps.filter(r => r.status === 'COMPLETED').length,
          totalAreas: totalAreas,
          completedAreas: completedAreas
        };
      },

      loadExampleRoadmaps: () => {
        const exampleRoadmaps = [
          {
            id: 'ROADMAP-001',
            title: 'Vistoria Região Norte - Janeiro 2025',
            description: 'Inspeção preventiva nas áreas de risco da região norte de Goiânia após período chuvoso intenso.',
            inspector: 'João Silva',
            priority: 'HIGH',
            estimatedDays: 5,
            status: 'ACTIVE',
            createdAt: new Date('2025-01-15').toISOString(),
            createdBy: 'admin',
            areas: [
              {
                id: 'R1-GO-001',
                name: 'Encosta do Morro da Cruz',
                municipality: 'Goiânia',
                neighborhood: 'Jardim das Oliveiras',
                riskType: 'Deslizamento',
                status: 'COMPLETED',
                inspectedAt: new Date('2025-01-16').toISOString(),
                inspector: 'João Silva'
              },
              {
                id: 'R1-GO-002', 
                name: 'Vale do Jardim Petrópolis',
                municipality: 'Goiânia',
                neighborhood: 'Jardim Petrópolis',
                riskType: 'Alagamento',
                status: 'IN_PROGRESS',
                inspectedAt: null,
                inspector: null
              },
              {
                id: 'R1-GO-003',
                name: 'Córrego do Bacalhau',
                municipality: 'Goiânia',
                neighborhood: 'Setor Norte Ferroviário',
                riskType: 'Enchente',
                status: 'PENDING',
                inspectedAt: null,
                inspector: null
              }
            ],
            inspections: [
              {
                id: 'INSP-001',
                roadmapId: 'ROADMAP-001',
                areaId: 'R1-GO-001',
                areaName: 'Encosta do Morro da Cruz',
                status: 'COMPLETED',
                findings: 'Identificadas rachaduras em 3 residências na parte alta da encosta. Solo apresenta sinais de instabilidade após chuvas recentes. Drenagem inadequada contribui para o acúmulo de água.',
                recommendations: 'Recomenda-se evacuação preventiva de 2 residências em situação crítica. Implementar sistema de drenagem emergencial. Monitoramento contínuo durante período chuvoso.',
                riskLevel: 'HIGH',
                inspector: 'João Silva',
                inspectedAt: new Date('2025-01-16').toISOString()
              }
            ]
          },
          {
            id: 'ROADMAP-002',
            title: 'Monitoramento Áreas Críticas - Região Sul',
            description: 'Acompanhamento mensal das áreas classificadas como alto risco na região sul da cidade.',
            inspector: 'Maria Santos',
            priority: 'MEDIUM', 
            estimatedDays: 3,
            status: 'PLANNED',
            createdAt: new Date('2025-01-18').toISOString(),
            createdBy: 'admin',
            areas: [
              {
                id: 'R1-GO-004',
                name: 'Setor Vila Nova',
                municipality: 'Goiânia',
                neighborhood: 'Vila Nova',
                riskType: 'Deslizamento',
                status: 'PENDING',
                inspectedAt: null,
                inspector: null
              },
              {
                id: 'R1-GO-005',
                name: 'Margem do Rio Meia Ponte',
                municipality: 'Goiânia',
                neighborhood: 'Setor Sul',
                riskType: 'Enchente',
                status: 'PENDING', 
                inspectedAt: null,
                inspector: null
              }
            ],
            inspections: []
          },
          {
            id: 'ROADMAP-003',
            title: 'Vistoria Emergencial Pós-Temporal',
            description: 'Verificação urgente após temporal com ventos de 80km/h e chuva intensa que atingiu a região metropolitana.',
            inspector: 'Carlos Roberto',
            priority: 'HIGH',
            estimatedDays: 2,
            status: 'ACTIVE',
            createdAt: new Date('2025-01-20').toISOString(),
            createdBy: 'admin',
            areas: [
              {
                id: 'R1-GO-006',
                name: 'Favela do Jardim Novo Mundo',
                municipality: 'Goiânia',
                neighborhood: 'Jardim Novo Mundo',
                riskType: 'Tempestade',
                status: 'COMPLETED',
                inspectedAt: new Date('2025-01-20').toISOString(),
                inspector: 'Carlos Roberto'
              },
              {
                id: 'R1-GO-007',
                name: 'Área Industrial Oeste',
                municipality: 'Goiânia',
                neighborhood: 'Distrito Industrial',
                riskType: 'Tempestade',
                status: 'COMPLETED',
                inspectedAt: new Date('2025-01-20').toISOString(),
                inspector: 'Carlos Roberto'
              }
            ],
            inspections: [
              {
                id: 'INSP-002',
                roadmapId: 'ROADMAP-003',
                areaId: 'R1-GO-006',
                areaName: 'Favela do Jardim Novo Mundo',
                status: 'COMPLETED',
                findings: 'Queda de árvores bloqueou via principal. Destelhamento em 15 residências. Alagamento em área baixa com 40cm de altura. Rede elétrica danificada.',
                recommendations: 'Remoção imediata de árvores caídas. Distribuição de lonas para coberturas temporárias. Bombeamento da água acumulada. Isolamento da rede elétrica danificada.',
                riskLevel: 'HIGH',
                inspector: 'Carlos Roberto',
                inspectedAt: new Date('2025-01-20').toISOString()
              },
              {
                id: 'INSP-003',
                roadmapId: 'ROADMAP-003',
                areaId: 'R1-GO-007',
                areaName: 'Área Industrial Oeste',
                status: 'COMPLETED',
                findings: 'Galpão industrial com estrutura comprometida. Telhas metálicas espalhadas pela via. Container de produtos químicos deslocado mas íntegro.',
                recommendations: 'Interdição imediata do galpão. Limpeza da via para liberação do tráfego. Verificação técnica do container químico. Comunicação à empresa responsável.',
                riskLevel: 'MEDIUM',
                inspector: 'Carlos Roberto',
                inspectedAt: new Date('2025-01-20').toISOString()
              }
            ]
          },
          {
            id: 'ROADMAP-004',
            title: 'Manutenção Preventiva - Período Seco',
            description: 'Aproveitamento do período seco para obras de contenção e melhorias estruturais em áreas de risco.',
            inspector: 'Ana Paula',
            priority: 'LOW',
            estimatedDays: 10,
            status: 'PLANNED',
            createdAt: new Date('2025-01-22').toISOString(),
            createdBy: 'admin',
            areas: [
              {
                id: 'R1-GO-008',
                name: 'Encosta do Bairro Popular',
                municipality: 'Goiânia',
                neighborhood: 'Bairro Popular',
                riskType: 'Erosão',
                status: 'PENDING',
                inspectedAt: null,
                inspector: null
              },
              {
                id: 'R1-GO-009',
                name: 'Área de Preservação - Córrego Cascavel',
                municipality: 'Goiânia',
                neighborhood: 'Vila Cascavel',
                riskType: 'Enchente',
                status: 'PENDING',
                inspectedAt: null,
                inspector: null
              },
              {
                id: 'R1-GO-010',
                name: 'Complexo Habitacional São José',
                municipality: 'Goiânia',
                neighborhood: 'São José',
                riskType: 'Deslizamento',
                status: 'PENDING',
                inspectedAt: null,
                inspector: null
              }
            ],
            inspections: []
          }
        ];

        set(state => ({
          inspectionRoadmaps: exampleRoadmaps
        }));

        console.log('✅ Dados de exemplo dos roadmaps carregados:', exampleRoadmaps.length, 'roadmaps');
      },

      getAreasForInspection: () => {
        const { riskAreas, userSubmissions, removalRequests } = get();
        
        const getPriorityLevel = (area, submissions, requests) => {
          let priority = 0;
          
          if (area.nivelAmeaca?.toLowerCase() === 'alto') priority += 50;
          else if (area.nivelAmeaca?.toLowerCase() === 'médio') priority += 30;
          else priority += 10;
          
          const areaRequests = requests.filter(req => req.areaId === area.id).length;
          const areaSubmissions = submissions.filter(sub => sub.areaId === area.id).length;
          priority += (areaRequests + areaSubmissions) * 5;
          
          const daysSinceUpdate = area.ultimaAtualizacao ? 
            Math.floor((new Date() - new Date(area.ultimaAtualizacao)) / (1000 * 60 * 60 * 24)) : 365;
          if (daysSinceUpdate > 180) priority += 20;
          else if (daysSinceUpdate > 90) priority += 10;
          
          return priority;
        };

        const getLastInspectionDate = (area) => {
          return area.ultimaAtualizacao || 'Não informado';
        };

        const getAreaRequestCount = (areaId, submissions, requests) => {
          const requestCount = requests.filter(req => req.areaId === areaId).length;
          const submissionCount = submissions.filter(sub => sub.areaId === areaId).length;
          return requestCount + submissionCount;
        };
        
        return Object.values(riskAreas).map(area => ({
          ...area,
          priority: getPriorityLevel(area, userSubmissions, removalRequests),
          lastInspection: getLastInspectionDate(area),
          requestCount: getAreaRequestCount(area.id, userSubmissions, removalRequests)
        })).sort((a, b) => b.priority - a.priority);
      },

      showVotingWarning: () => {
        console.log('⚠️ Aviso de Votação Responsável ativado');
      },
    }),
    {
      name: 'sigar-app-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        authToken: state.authToken,
        userTokens: state.userTokens,
        userSubmissions: state.userSubmissions,
        removalRequests: state.removalRequests,
        userVotes: state.userVotes,
        votingHistory: state.votingHistory,
        withdrawHistory: state.withdrawHistory,
        inspectionRoadmaps: state.inspectionRoadmaps,
      }),
    }
  )
);

export default useAppStore;
