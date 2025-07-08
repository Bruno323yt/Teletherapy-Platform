// Modo de desarrollo - cambiar a false para usar backend real
export const OFFLINE_MODE = true

// Para desarrollo local desde mobile, usar IP de la red local
export const API_BASE_URL = 'http://192.168.100.129:8000'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login/',
  REGISTER: '/api/auth/register/',
  REFRESH: '/api/auth/token/refresh/',
  LOGOUT: '/api/auth/logout/',
  
  // Users
  USER_PROFILE: '/api/auth/profile/',
  UPDATE_PROFILE: '/api/auth/profile/update/',
  
  // Sessions
  SESSIONS: '/api/sessions/',
  SESSION_MESSAGES: (sessionId: string) => `/api/sessions/${sessionId}/messages/`,
  
  // Patient specific
  PATIENT_PROFILE: '/api/auth/patient/profile/',
  PATIENT_SESSIONS: '/api/sessions/patient/',
  
  // Therapist specific
  THERAPIST_PROFILE: '/api/auth/therapist/profile/',
  THERAPIST_SESSIONS: '/api/sessions/therapist/',
  THERAPISTS_LIST: '/api/auth/therapists/',
  
  // Settings
  USER_SETTINGS: '/api/settings/',
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  USER_SETTINGS: 'userSettings',
} as const

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const USER_ROLES = {
  PATIENT: 'paciente',
  THERAPIST: 'terapeuta',
  ADMIN: 'admin',
} as const

export const JITSI_CONFIG = {
  DOMAIN: 'meet.jit.si',
  ROOM_PREFIX: 'teletherapy-',
} as const