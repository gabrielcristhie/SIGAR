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
            
            set({ 
              isAuthenticated: true,
              user: mockUser,
              authToken: mockToken,
              loading: false,
              isLoginModalOpen: false,
              loginActionTitle: ''
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
          
          set({ 
            isAuthenticated: true,
            user: mockUser,
            authToken: token
          });
        }

        get().fetchRiskAreas();
      }
    }),
    {
      name: 'sigar-app-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        authToken: state.authToken,
      }),
    }
  )
);

export default useAppStore;
