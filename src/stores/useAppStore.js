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

      removalRequests: [],
      isRemovalModalOpen: false,

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
              name: 'Usuário Simulado',
              role: 'admin',
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
        if (username === 'demo' || username === 'admin') {
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
      }),
    }
  )
);

export default useAppStore;
