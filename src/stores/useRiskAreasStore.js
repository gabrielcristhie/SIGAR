import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { riskAreasData } from '../data/mockData';
import { apiService } from '../services/api';

const useRiskAreasStore = create(
  persist(
    (set, get) => ({
      riskAreas: riskAreasData,
      selectedAreaId: null,
      isInfoPanelOpen: false,
      loading: false,
      error: null,

      fetchRiskAreas: async () => {
        set({ loading: true, error: null });
        try {
          try {
            const response = await apiService.getRiskAreas();
            set({ riskAreas: response.data, loading: false });
          } catch {
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
        set({ 
          selectedAreaId: areaId
        });
      },

      toggleInfoPanel: (isOpen) => {
        set({ isInfoPanelOpen: isOpen });
        if (!isOpen) {
          set({ selectedAreaId: null });
        }
      },

      getSelectedArea: () => {
        const { riskAreas, selectedAreaId } = get();
        if (!selectedAreaId) return null;
        const area = Object.values(riskAreas).find(area => area.id === selectedAreaId);
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
          } catch {
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
          } catch {
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

      removeRiskArea: (areaId) => {
        set(state => {
          const newRiskAreas = { ...state.riskAreas };
          const keyToRemove = Object.keys(newRiskAreas).find(key => 
            newRiskAreas[key].id === areaId
          );
          
          if (keyToRemove) {
            delete newRiskAreas[keyToRemove];
          }

          return {
            riskAreas: newRiskAreas,
            selectedAreaId: state.selectedAreaId === areaId ? null : state.selectedAreaId,
            isInfoPanelOpen: state.selectedAreaId === areaId ? false : state.isInfoPanelOpen
          };
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'sigar-risk-areas-storage',
      partialize: (state) => ({
        riskAreas: state.riskAreas
      })
    }
  )
);

export default useRiskAreasStore;
