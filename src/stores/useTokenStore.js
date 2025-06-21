import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTokenStore = create(
  persist(
    (set, get) => ({
      userTokens: 0,
      isTokenModalOpen: false,
      tokenNotification: {
        show: false,
        tokens: 0,
        message: ''
      },

      COIN_VALUE: 0.50,
      MIN_WITHDRAWAL: 20,

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

      addTokens: (amount, reason = '') => {
        set(state => ({
          userTokens: state.userTokens + amount
        }));
        
        if (reason) {
          get().showTokenNotification(amount, reason);
        }
      },

      deductTokens: (amount, reason = '') => {
        set(state => ({
          userTokens: Math.max(0, state.userTokens - amount)
        }));
        
        if (reason) {
          get().showTokenNotification(-amount, reason);
        }
      },

      setTokens: (amount) => {
        set({ userTokens: amount });
      },

      getTokenBalance: () => {
        return get().userTokens;
      },

      getTokenValue: (tokens) => {
        return tokens * get().COIN_VALUE;
      },

      canWithdraw: () => {
        const { userTokens, MIN_WITHDRAWAL } = get();
        return userTokens >= MIN_WITHDRAWAL;
      },

      getWithdrawableAmount: () => {
        const { userTokens, COIN_VALUE } = get();
        return userTokens * COIN_VALUE;
      }
    }),
    {
      name: 'sigar-token-storage',
      partialize: (state) => ({
        userTokens: state.userTokens
      })
    }
  )
);

export default useTokenStore;
