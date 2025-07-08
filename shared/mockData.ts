import { User, Patient, Therapist, Session } from './types'

// Usuarios demo para desarrollo
export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'paciente_demo',
    email: 'paciente@demo.com',
    role: 'paciente',
    first_name: 'María',
    last_name: 'González',
    bio: 'Paciente demo para pruebas de la aplicación',
    language: 'es',
    theme: 'light',
    timezone: 'America/Mexico_City'
  },
  {
    id: '2', 
    username: 'terapeuta_demo',
    email: 'terapeuta@demo.com',
    role: 'terapeuta',
    first_name: 'Dr. Carlos',
    last_name: 'Mendoza',
    bio: 'Psicólogo clínico especializado en terapia cognitivo-conductual',
    language: 'es',
    theme: 'light',
    timezone: 'America/Mexico_City'
  }
]

// Pacientes demo
export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    user: MOCK_USERS[0],
    initial_anxiety_level: 7,
    initial_depression_level: 5,
    test_results: {
      anxiety_score: 14,
      depression_score: 10,
      completed_at: '2024-01-15T10:00:00Z'
    },
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
]

// Terapeutas demo
export const MOCK_THERAPISTS: Therapist[] = [
  {
    id: '1',
    user: MOCK_USERS[1],
    specialties: ['Ansiedad', 'Depresión', 'Terapia Cognitivo-Conductual'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
      start_time: '09:00',
      end_time: '17:00'
    },
    rating: 4.8,
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-20T12:00:00Z'
  }
]

// Sesiones demo
export const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    patient: MOCK_PATIENTS[0],
    therapist: MOCK_THERAPISTS[0],
    scheduled_time: '2024-07-10T15:00:00Z',
    duration_minutes: 60,
    jitsi_room_name: 'teletherapy-session-1',
    status: 'confirmed',
    notes: 'Primera sesión - evaluación inicial',
    patient_feedback: '',
    therapist_feedback: '',
    created_at: '2024-07-08T10:00:00Z',
    updated_at: '2024-07-08T10:00:00Z'
  },
  {
    id: '2',
    patient: MOCK_PATIENTS[0],
    therapist: MOCK_THERAPISTS[0],
    scheduled_time: '2024-07-12T15:00:00Z',
    duration_minutes: 60,
    jitsi_room_name: 'teletherapy-session-2',
    status: 'scheduled',
    notes: 'Seguimiento - técnicas de relajación',
    patient_feedback: '',
    therapist_feedback: '',
    created_at: '2024-07-08T10:05:00Z',
    updated_at: '2024-07-08T10:05:00Z'
  },
  {
    id: '3',
    patient: MOCK_PATIENTS[0],
    therapist: MOCK_THERAPISTS[0],
    scheduled_time: '2024-07-05T14:00:00Z',
    duration_minutes: 60,
    jitsi_room_name: 'teletherapy-session-3',
    status: 'completed',
    notes: 'Sesión completada exitosamente',
    patient_feedback: 'Muy útil, me siento mejor',
    therapist_feedback: 'Paciente muestra progreso notable',
    created_at: '2024-07-03T09:00:00Z',
    updated_at: '2024-07-05T15:00:00Z'
  }
]

// Función para obtener sesiones por usuario
export const getMockSessionsForUser = (userId: string, role: 'paciente' | 'terapeuta'): Session[] => {
  if (role === 'paciente') {
    return MOCK_SESSIONS.filter(session => session.patient.user.id === userId)
  } else {
    return MOCK_SESSIONS.filter(session => session.therapist.user.id === userId)
  }
}

// Función para obtener perfil del usuario
export const getMockUserProfile = (userId: string) => {
  return MOCK_USERS.find(user => user.id === userId)
}

// Función para login demo
export const mockLogin = (username: string): User | null => {
  return MOCK_USERS.find(user => 
    user.username === username || 
    user.email === username
  ) || null
}

// Función para registro demo
export const mockRegister = (userData: any): User => {
  const newUser: User = {
    id: (MOCK_USERS.length + 1).toString(),
    username: userData.username,
    email: userData.email,
    role: userData.role,
    first_name: userData.first_name,
    last_name: userData.last_name,
    bio: '',
    language: 'es',
    theme: 'light',
    timezone: 'America/Mexico_City'
  }
  
  MOCK_USERS.push(newUser)
  return newUser
}