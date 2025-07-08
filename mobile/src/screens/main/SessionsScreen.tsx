import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../services/apiClient';
import { mockApiClient } from '../../services/mockApiClient';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Session } from '../../../../shared/types';
import { OFFLINE_MODE } from '../../../../shared/constants';

export function SessionsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
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
      
      setSessions(response.results);
    } catch (error) {
      console.error('Error loading sessions:', error);
      Alert.alert('Error', 'No se pudieron cargar las sesiones');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (sessionId: string) => {
    (navigation as any).navigate('VideoCall', { sessionId });
  };

  const renderSession = ({ item }: { item: Session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>
          {user?.role === 'paciente'
            ? `Dr. ${item.therapist.user.first_name} ${item.therapist.user.last_name}`
            : `${item.patient.user.first_name} ${item.patient.user.last_name}`
          }
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.sessionInfo}>
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text style={styles.sessionDate}>
          {new Date(item.scheduled_time).toLocaleDateString('es-ES', {
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
          {new Date(item.scheduled_time).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.sessionActions}>
        {item.status === 'confirmed' && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoinSession(item.id)}
          >
            <Ionicons name="videocam-outline" size={20} color="#fff" />
            <Text style={styles.joinButtonText}>Unirse</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyStateText}>No tienes sesiones programadas</Text>
          </View>
        }
      />
    </View>
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
  listContainer: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: '#fff',
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
    marginBottom: 8,
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
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
});