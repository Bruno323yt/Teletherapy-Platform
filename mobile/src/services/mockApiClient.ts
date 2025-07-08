import { 
  User, 
  Patient, 
  Therapist, 
  Session, 
  Message, 
  ApiResponse,
} from '../../../shared/types';
import { 
  MOCK_SESSIONS, 
  MOCK_PATIENTS, 
  MOCK_THERAPISTS,
  getMockSessionsForUser 
} from '../../../shared/mockData';

// Cliente API mock para modo offline
export class MockApiClient {
  async getUserProfile(): Promise<User> {
    // El usuario ya está en el store
    throw new Error('Use el usuario del store');
  }

  async getPatientProfile(): Promise<Patient> {
    return MOCK_PATIENTS[0];
  }

  async getPatientSessions(): Promise<ApiResponse<Session>> {
    const sessions = getMockSessionsForUser('1', 'paciente');
    return {
      results: sessions,
      count: sessions.length,
      next: null,
      previous: null,
    };
  }

  async getTherapistProfile(): Promise<Therapist> {
    return MOCK_THERAPISTS[0];
  }

  async getTherapistSessions(): Promise<ApiResponse<Session>> {
    const sessions = getMockSessionsForUser('2', 'terapeuta');
    return {
      results: sessions,
      count: sessions.length,
      next: null,
      previous: null,
    };
  }

  async getSessions(): Promise<ApiResponse<Session>> {
    return {
      results: MOCK_SESSIONS,
      count: MOCK_SESSIONS.length,
      next: null,
      previous: null,
    };
  }

  async getSession(sessionId: string): Promise<Session> {
    const session = MOCK_SESSIONS.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }
    return session;
  }

  async updateSession(sessionId: string, data: Partial<Session>): Promise<Session> {
    const sessionIndex = MOCK_SESSIONS.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Sesión no encontrada');
    }
    
    MOCK_SESSIONS[sessionIndex] = { ...MOCK_SESSIONS[sessionIndex], ...data };
    return MOCK_SESSIONS[sessionIndex];
  }

  async getSessionMessages(sessionId: string): Promise<ApiResponse<Message>> {
    // Mensajes mock básicos
    const mockMessages: Message[] = [
      {
        id: '1',
        session: sessionId,
        sender: MOCK_PATIENTS[0].user,
        content: 'Hola, ¿cómo está?',
        timestamp: new Date().toISOString(),
        is_read: true,
      },
      {
        id: '2',
        session: sessionId,
        sender: MOCK_THERAPISTS[0].user,
        content: 'Hola, muy bien gracias. ¿Cómo se siente hoy?',
        timestamp: new Date(Date.now() + 60000).toISOString(),
        is_read: true,
      },
    ];

    return {
      results: mockMessages,
      count: mockMessages.length,
      next: null,
      previous: null,
    };
  }

  async sendMessage(sessionId: string, content: string): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString(),
      session: sessionId,
      sender: MOCK_PATIENTS[0].user, // Asumir que el paciente envía
      content,
      timestamp: new Date().toISOString(),
      is_read: false,
    };

    return newMessage;
  }

  async getUserSettings(): Promise<any> {
    return {
      notifications: true,
      theme: 'light',
      language: 'es',
    };
  }

  async updateUserSettings(data: any): Promise<any> {
    return { ...data };
  }
}

export const mockApiClient = new MockApiClient();