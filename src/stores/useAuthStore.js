import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      authToken: null,
      
      isLoginModalOpen: false,
      loginActionTitle: '',
      
      loading: false,
      error: null,

      toggleLoginModal: (isOpen, actionTitle = '') => {
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
          } catch {
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

      initializeAuth: () => {
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
      }
    }),
    {
      name: 'sigar-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        authToken: state.authToken
      })
    }
  )
);

export default useAuthStore;
