export interface User {
  id: string
  username: string
  email: string
  role: 'paciente' | 'terapeuta' | 'admin'
  first_name: string
  last_name: string
  bio?: string
  language?: string
  theme?: string
  timezone?: string
}

export interface Patient {
  id: string
  user: User
  initial_anxiety_level: number
  initial_depression_level: number
  test_results: any
  created_at: string
  updated_at: string
}

export interface Therapist {
  id: string
  user: User
  specialties: string[]
  availability: any
  rating: number
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  patient: Patient
  therapist: Therapist
  scheduled_time: string
  duration_minutes: number
  jitsi_room_name: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  patient_feedback?: string
  therapist_feedback?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  session: string
  sender: User
  content: string
  timestamp: string
  is_read: boolean
}

export interface ApiResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'paciente' | 'terapeuta'
}