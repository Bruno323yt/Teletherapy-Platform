import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData } from '../../../shared/types';
import { STORAGE_KEYS, OFFLINE_MODE } from '../../../shared/constants';
import { mockLogin, mockRegister, getMockUserProfile } from '../../../shared/mockData';
import { apiClient } from '../services/apiClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  loginDemo: (userType: 'paciente' | 'terapeuta') => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      if (OFFLINE_MODE) {
        // Modo offline - usar datos mock
        const user = mockLogin(credentials.username);
        if (!user) {
          throw new Error('Usuario no encontrado. Usa: paciente_demo o terapeuta_demo');
        }
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        // Modo online - usar API real
        const tokens = await apiClient.login(credentials);
        const user = await apiClient.getUserProfile();
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false 
      });
      throw error;
    }
  },

  loginDemo: async (userType: 'paciente' | 'terapeuta') => {
    set({ isLoading: true, error: null });
    try {
      const username = userType === 'paciente' ? 'paciente_demo' : 'terapeuta_demo';
      const user = mockLogin(username);
      
      if (!user) {
        throw new Error('Usuario demo no encontrado');
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al iniciar sesión demo',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      if (OFFLINE_MODE) {
        // Modo offline - crear usuario mock
        const user = mockRegister(data);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        // Modo online - usar API real
        const user = await apiClient.register(data);
        
        // Después del registro, hacer login automático
        await get().login({
          username: data.username,
          password: data.password,
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || error.response?.data?.message || 'Error al registrarse',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.logout();
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      // Incluso si hay error, limpiamos el estado local
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (accessToken && userData) {
        const user = JSON.parse(userData);
        
        // Verificar si el token sigue siendo válido
        try {
          await apiClient.getUserProfile();
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // Token inválido, limpiar storage
          await get().logout();
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await apiClient.updateUserProfile(data);
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
      set({ 
        user: updatedUser, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al actualizar el perfil',
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));