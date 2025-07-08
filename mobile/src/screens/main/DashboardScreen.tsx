import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../services/apiClient';
import { mockApiClient } from '../../services/mockApiClient';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Session } from '../../../../shared/types';
import { OFFLINE_MODE } from '../../../../shared/constants';

export function DashboardScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      let response;
      if (OFFLINE_MODE) {
        // Usar datos mock
        response = user?.role === 'paciente' 
          ? await mockApiClient.getPatientSessions()
          : await mockApiClient.getTherapistSessions();
      } else {
        // Usar API real
        response = user?.role === 'paciente' 
          ? await apiClient.getPatientSessions()
          : await apiClient.getTherapistSessions();
      }
      
      setSessions(response.results.slice(0, 3)); // Mostrar solo las próximas 3 sesiones
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: logout },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {user?.first_name}!</Text>
          <Text style={styles.subtitle}>
            {user?.role === 'paciente' ? 'Cuidemos tu bienestar' : 'Ayudemos a tus pacientes'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar-outline" size={32} color="#3B82F6" />
          </View>
          <Text style={styles.statNumber}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Próximas Sesiones</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="heart-outline" size={32} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>
            {user?.role === 'paciente' ? '8.5' : '4.8'}
          </Text>
          <Text style={styles.statLabel}>
            {user?.role === 'paciente' ? 'Bienestar' : 'Calificación'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximas Sesiones</Text>
        
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>
                  {user?.role === 'paciente'
                    ? `Dr. ${session.therapist.user.first_name} ${session.therapist.user.last_name}`
                    : `${session.patient.user.first_name} ${session.patient.user.last_name}`
                  }
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(session.status)}</Text>
                </View>
              </View>
              
              <View style={styles.sessionInfo}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={styles.sessionDate}>
                  {new Date(session.scheduled_time).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              
              <View style={styles.sessionInfo}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.sessionTime}>
                  {new Date(session.scheduled_time).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#6B7280" />
            <Text style={styles.emptyStateText}>No tienes sesiones programadas</Text>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="videocam-outline" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Unirse a Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#10B981" />
          <Text style={styles.actionButtonText}>Mensajes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={24} color="#6B7280" />
          <Text style={styles.actionButtonText}>Configuración</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return '#3B82F6';
    case 'confirmed':
      return '#10B981';
    case 'in_progress':
      return '#F59E0B';
    case 'completed':
      return '#6B7280';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'Programada';
    case 'confirmed':
      return 'Confirmada';
    case 'in_progress':
      return 'En progreso';
    case 'completed':
      return 'Completada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Desconocido';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  sessionTime: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  quickActions: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
});