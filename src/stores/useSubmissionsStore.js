import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSubmissionsStore = create(
  persist(
    (set, get) => ({
      userSubmissions: [],
      removalRequests: [],
      isRemovalModalOpen: false,

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

        set(state => ({
          userSubmissions: [...state.userSubmissions, submission]
        }));

        return submission;
      },

      updateSubmissionStatus: (submissionId, status, reviewNotes = '') => {
        set(state => {
          const updatedSubmissions = state.userSubmissions.map(sub => {
            if (sub.id === submissionId) {
              return {
                ...sub,
                status,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'Sistema Técnico',
                reviewNotes
              };
            }
            return sub;
          });

          return {
            userSubmissions: updatedSubmissions
          };
        });
      },

      approveSubmission: (submissionId, reviewNotes = '') => {
        set(state => {
          const updatedSubmissions = state.userSubmissions.map(sub => {
            if (sub.id === submissionId) {
              return {
                ...sub,
                status: 'APPROVED',
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

      rejectSubmission: (submissionId, reviewNotes = '') => {
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

      getUserStats: () => {
        const { userSubmissions } = get();
        return {
          totalSubmissions: userSubmissions.length,
          approvedSubmissions: userSubmissions.filter(sub => sub.status === 'APPROVED').length,
          pendingSubmissions: userSubmissions.filter(sub => sub.status === 'PENDING').length,
          rejectedSubmissions: userSubmissions.filter(sub => sub.status === 'REJECTED').length
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

      toggleRemovalModal: (isOpen) => {
        set({ isRemovalModalOpen: isOpen });
      },

      requestAreaRemoval: (areaId, areaName, reason, justification, user) => {
        const removalRequest = {
          id: `REM-${Date.now()}`,
          areaId: areaId,
          areaName: areaName,
          requestedBy: user?.name || 'Usuário',
          requestedAt: new Date().toISOString(),
          reason: reason,
          justification: justification,
          status: 'PENDING',
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: '',
          priority: 'MEDIUM'
        };

        set(state => ({
          removalRequests: [...state.removalRequests, removalRequest]
        }));

        return removalRequest;
      },

      approveRemovalRequest: (requestId, reviewNotes = '') => {
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

      setUserData: (userData) => {
        set({
          userSubmissions: userData.submissions || [],
          removalRequests: userData.removalRequests || []
        });
      }
    }),
    {
      name: 'sigar-submissions-storage',
      partialize: (state) => ({
        userSubmissions: state.userSubmissions,
        removalRequests: state.removalRequests
      })
    }
  )
);

export default useSubmissionsStore;
