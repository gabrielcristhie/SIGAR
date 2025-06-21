import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVotingStore = create(
  persist(
    (set, get) => ({
      userVotes: [],
      votingHistory: [],

      submitVote: (requestId, requestType, voteType, justification, user) => {
        console.log('🗳️ Submetendo voto:', { requestId, requestType, voteType });
        
        const vote = {
          id: `VOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          requestId,
          requestType,
          voteType,
          justification,
          votedBy: user?.username || 'anonymous',
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

      validateVote: (voteId, isCorrect, adminNotes = '', user) => {
        console.log('✅ Validando voto:', voteId, 'Correto:', isCorrect);
        
        set(state => {
          const updatedVotes = state.userVotes.map(vote => {
            if (vote.id === voteId) {
              const updatedVote = {
                ...vote,
                validated: true,
                validatedAt: new Date().toISOString(),
                validatedBy: user?.username,
                isCorrect,
                adminNotes
              };

              if (!isCorrect && !vote.penaltyApplied) {
                return {
                  ...updatedVote,
                  penaltyApplied: true,
                  tokensDeducted: 15
                };
              }

              return updatedVote;
            }
            return vote;
          });

          const updatedHistory = state.votingHistory.map(vote => 
            vote.id === voteId ? updatedVotes.find(v => v.id === voteId) : vote
          );

          return {
            userVotes: updatedVotes,
            votingHistory: updatedHistory
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

      showVotingWarning: () => {
        console.log('⚠️ Aviso de Votação Responsável ativado');
      }
    }),
    {
      name: 'sigar-voting-storage',
      partialize: (state) => ({
        userVotes: state.userVotes,
        votingHistory: state.votingHistory
      })
    }
  )
);

export default useVotingStore;
