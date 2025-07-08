import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { apiClient } from '../../services/apiClient';
import { mockApiClient } from '../../services/mockApiClient';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { generateJitsiUrl } from '../../../../shared/utils';
import { OFFLINE_MODE } from '../../../../shared/constants';

type Props = StackScreenProps<MainStackParamList, 'VideoCall'>;

const { width, height } = Dimensions.get('window');

export function VideoCallScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;
  const [jitsiUrl, setJitsiUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      
      let session;
      if (OFFLINE_MODE) {
        session = await mockApiClient.getSession(sessionId);
      } else {
        session = await apiClient.getSession(sessionId);
      }
      
      const url = generateJitsiUrl(session.id);
      setJitsiUrl(url);
    } catch (error) {
      console.error('Error loading session:', error);
      setError('No se pudo cargar la sesión de videollamada');
      Alert.alert('Error', 'No se pudo cargar la sesión de videollamada');
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    Alert.alert(
      'Finalizar Llamada',
      '¿Estás seguro de que quieres finalizar la videollamada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Conectando a la videollamada...</Text>
      </View>
    );
  }

  if (error || !jitsiUrl) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Error de Conexión</Text>
        <Text style={styles.errorText}>
          {error || 'No se pudo establecer la conexión con la videollamada'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSession}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Videollamada en Progreso</Text>
        <TouchableOpacity onPress={handleEndCall} style={styles.endCallButton}>
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.endCallText}>Finalizar</Text>
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
          setError('Error al cargar la videollamada');
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error: ', nativeEvent.statusCode);
          setError(`Error HTTP: ${nativeEvent.statusCode}`);
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <LoadingSpinner size="large" />
            <Text style={styles.loadingText}>Cargando videollamada...</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Teleterapia - Sesión Segura y Privada
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  endCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  endCallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  webview: {
    flex: 1,
    width: width,
    height: height - 120,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  footer: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});