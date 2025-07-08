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
                    <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 therapy-calm-bg border border-border rounded-xl hover:shadow-card-hover transition-all duration-200">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h3 className="font-semibold text-foreground text-lg">{session.therapist}</h3>
                        <p className="text-muted-foreground mt-1 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {session.date} a las {session.time}
                        </p>
                        <Badge variant="primary" className="mt-3 bg-primary/10 text-primary border-primary/20">
                          {session.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" className="order-2 sm:order-1">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Detalles
                        </Button>
                        <Button variant="primary" size="sm" className="order-1 sm:order-2 therapy-gradient border-0">
                          <VideoCameraIcon className="h-4 w-4 mr-2" />
                          Unirse
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="therapy-calm-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDaysIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No hay sesiones programadas</h3>
                  <p className="text-muted-foreground mb-6">Encuentra un terapeuta y agenda tu primera sesión</p>
                  <Button variant="primary" className="therapy-gradient border-0">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
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
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 therapy-calm-bg rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Sesiones completadas</span>
                      <p className="font-semibold text-foreground text-lg">12</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                      <ChartBarIcon className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Progreso general</span>
                      <p className="font-semibold text-success text-lg">85%</p>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-success/20 rounded-full">
                    <div className="w-[85%] h-full bg-success rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                      <CalendarDaysIcon className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Próxima sesión</span>
                      <p className="font-semibold text-foreground text-lg">En 2 días</p>
                    </div>
                  </div>
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
                  <div key={therapist.id} className="group bg-card border border-border rounded-xl p-6 hover:shadow-card-hover hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 therapy-gradient rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-lg">
                            {therapist.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{therapist.name}</h3>
                          <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={therapist.available ? "success" : "warning"}
                        className={therapist.available ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}
                      >
                        {therapist.available ? "Disponible" : "Ocupado"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(therapist.rating) 
                                ? 'text-warning' 
                                : 'text-muted-foreground/30'
                            }`} 
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-foreground">
                          {therapist.rating}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {therapist.experience} años
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        Ver Perfil
                      </Button>
                      <Button variant="primary" size="sm" className="flex-1 therapy-gradient border-0">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                    </div>
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
