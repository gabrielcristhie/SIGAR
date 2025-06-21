import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoadmapStore = create(
  persist(
    (set, get) => ({
      inspectionRoadmaps: [],
      isRoadmapModalOpen: false,
      withdrawHistory: [],
      isWithdrawModalOpen: false,

      toggleRoadmapModal: (isOpen) => {
        set({ isRoadmapModalOpen: isOpen });
      },

      toggleWithdrawModal: (isOpen) => {
        set({ isWithdrawModalOpen: isOpen });
      },

      createInspectionRoadmap: (roadmapData, user) => {
        const roadmap = {
          id: `ROADMAP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...roadmapData,
          createdAt: new Date().toISOString(),
          createdBy: user?.username || 'admin',
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
              }
            ]
          }
        ];

        set(() => ({
          inspectionRoadmaps: exampleRoadmaps
        }));

        console.log('✅ Dados de exemplo dos roadmaps carregados:', exampleRoadmaps.length, 'roadmaps');
      },

      getAreasForInspection: (riskAreas, userSubmissions, removalRequests) => {
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

      processWithdrawal: (withdrawData, userTokens, COIN_VALUE, MIN_WITHDRAWAL, user) => {
        const { coins, paymentMethod, accountInfo } = withdrawData;
        
        if (coins > userTokens) {
          throw new Error('Saldo insuficiente de SIGAR Coins');
        }
        
        if (coins < MIN_WITHDRAWAL) {
          throw new Error(`Saque mínimo de ${MIN_WITHDRAWAL} coins`);
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
          userId: user?.id,
          username: user?.username
        };

        set(state => ({
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
      }
    }),
    {
      name: 'sigar-roadmap-storage',
      partialize: (state) => ({
        inspectionRoadmaps: state.inspectionRoadmaps,
        withdrawHistory: state.withdrawHistory
      })
    }
  )
);

export default useRoadmapStore;
