import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router"
import api from "../services/api"

// Components
import AppHeader from "../../components/layout/AppHeader"
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle,
  Badge, 
  Modal, 
  LoadingSpinner, 
  Alert 
} from "../../components/ui"

// Icons
import { 
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  StarIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

function PatientDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const [therapists, setTherapists] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false)
      setSessions([
        {
          id: 1,
          therapist: "Dr. María González",
          date: "2024-01-15",
          time: "14:00",
          status: "confirmed",
          rating: 5
        }
      ])
      setTherapists([
        {
          id: 1,
          name: "Dr. María González",
          specialty: "Ansiedad y Depresión",
          rating: 4.8,
          experience: 8,
          available: true
        }
      ])
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors">
        <AppHeader title="Dashboard" subtitle="Bienvenido de vuelta" />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      <AppHeader 
        title="Dashboard" 
        subtitle="Bienvenido de vuelta" 
        notifications={2}
        onNotificationClick={() => setShowModal(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próxima sesión */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-500" />
                Próxima Sesión
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                          <div>
                        <h3 className="font-medium text-neutral-900">{session.therapist}</h3>
                        <p className="text-sm text-neutral-600">
                          {session.date} a las {session.time}
                        </p>
                        <Badge variant="primary" className="mt-2">
                          {session.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </Badge>
                          </div>
                      <Button variant="primary" size="sm">
                        <VideoCameraIcon className="h-4 w-4 mr-2" />
                              Unirse
                            </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">No tienes sesiones programadas</p>
                  <Button variant="outline" className="mt-4">
                    Buscar Terapeutas
                  </Button>
                </div>
              )}
            </CardContent>
            </Card>

          {/* Resumen rápido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-500" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Sesiones completadas</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Progreso general</span>
                  <span className="font-semibold text-success-600">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Próxima sesión</span>
                  <span className="font-semibold">En 2 días</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terapeutas recomendados */}
        <div className="mt-8">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-primary-500" />
                Terapeutas Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapists.map((therapist) => (
                  <div key={therapist.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-neutral-900">{therapist.name}</h3>
                        <p className="text-sm text-neutral-600">{therapist.specialty}</p>
                      </div>
                      <Badge variant={therapist.available ? "success" : "warning"}>
                        {therapist.available ? "Disponible" : "Ocupado"}
                      </Badge>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(therapist.rating) 
                                ? 'text-warning-400' 
                                : 'text-neutral-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-neutral-600">
                        {therapist.rating} ({therapist.experience} años)
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Perfil
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            </Card>
        </div>
      </main>

      {/* Modal de notificaciones */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Notificaciones"
        size="md"
      >
        <div className="space-y-4">
          <Alert 
            variant="info" 
            title="Nueva sesión programada"
            icon={CalendarDaysIcon}
          >
            Tu sesión con Dr. María González ha sido confirmada para mañana a las 14:00.
          </Alert>
          <Alert 
            variant="success" 
            title="Progreso actualizado"
            icon={ChartBarIcon}
          >
            Has completado el 85% de tu plan de tratamiento. ¡Excelente trabajo!
          </Alert>
        </div>
      </Modal>
    </div>
  )
}

export default PatientDashboard
