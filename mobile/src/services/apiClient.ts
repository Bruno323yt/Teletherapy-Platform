import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../../../shared/constants';
import { 
  User, 
  Patient, 
  Therapist, 
  Session, 
  Message, 
  ApiResponse, 
  AuthTokens,
  LoginCredentials,
  RegisterData 
} from '../../../shared/types';

class ApiClient {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para añadir token
    this.axios.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejo de errores
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.axios.post(API_ENDPOINTS.REFRESH, {
                refresh: refreshToken,
              });
              
              const { access } = response.data;
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
              originalRequest.headers.Authorization = `Bearer ${access}`;
              
              return this.axios(originalRequest);
            }
          } catch (refreshError) {
            await this.clearTokens();
            throw refreshError;
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await this.axios.post<AuthTokens>(API_ENDPOINTS.LOGIN, credentials);
    const { access, refresh } = response.data;
    
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    
    return response.data;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await this.axios.post<User>(API_ENDPOINTS.REGISTER, data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.axios.post(API_ENDPOINTS.LOGOUT);
    } finally {
      await this.clearTokens();
    }
  }

  async getUserProfile(): Promise<User> {
    const response = await this.axios.get<User>(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  }

  async updateUserProfile(data: Partial<User>): Promise<User> {
    const response = await this.axios.patch<User>(API_ENDPOINTS.USER_PROFILE, data);
    return response.data;
  }

  async getPatientProfile(): Promise<Patient> {
    const response = await this.axios.get<Patient>(API_ENDPOINTS.PATIENT_PROFILE);
    return response.data;
  }

  async getPatientSessions(): Promise<ApiResponse<Session>> {
    const response = await this.axios.get<ApiResponse<Session>>(API_ENDPOINTS.PATIENT_SESSIONS);
    return response.data;
  }

  async getTherapistProfile(): Promise<Therapist> {
    const response = await this.axios.get<Therapist>(API_ENDPOINTS.THERAPIST_PROFILE);
    return response.data;
  }

  async getTherapistSessions(): Promise<ApiResponse<Session>> {
    const response = await this.axios.get<ApiResponse<Session>>(API_ENDPOINTS.THERAPIST_SESSIONS);
    return response.data;
  }

  async getSessions(): Promise<ApiResponse<Session>> {
    const response = await this.axios.get<ApiResponse<Session>>(API_ENDPOINTS.SESSIONS);
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await this.axios.get<Session>(`${API_ENDPOINTS.SESSIONS}${sessionId}/`);
    return response.data;
  }

  async updateSession(sessionId: string, data: Partial<Session>): Promise<Session> {
    const response = await this.axios.patch<Session>(`${API_ENDPOINTS.SESSIONS}${sessionId}/`, data);
    return response.data;
  }

  async getSessionMessages(sessionId: string): Promise<ApiResponse<Message>> {
    const response = await this.axios.get<ApiResponse<Message>>(API_ENDPOINTS.SESSION_MESSAGES(sessionId));
    return response.data;
  }

  async sendMessage(sessionId: string, content: string): Promise<Message> {
    const response = await this.axios.post<Message>(API_ENDPOINTS.SESSION_MESSAGES(sessionId), {
      content,
    });
    return response.data;
  }

  async getUserSettings(): Promise<any> {
    const response = await this.axios.get(API_ENDPOINTS.USER_SETTINGS);
    return response.data;
  }

  async updateUserSettings(data: any): Promise<any> {
    const response = await this.axios.patch(API_ENDPOINTS.USER_SETTINGS, data);
    return response.data;
  }
}

export const apiClient = new ApiClient();