import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router"
import api from "../services/api"
import { Button, Card, LoadingSpinner } from "../../components/ui"

function TherapistDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await api.get("/sessions/")
      setSessions(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSession = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/confirm/`)
      fetchSessions()
    } catch (error) {
      console.error("Error confirming session:", error)
    }
  }

  const handleCancelSession = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/cancel/`)
      fetchSessions()
    } catch (error) {
      console.error("Error cancelling session:", error)
    }
  }

  const handleStartSession = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/start/`)
      navigate(`/session/${sessionId}`)
    } catch (error) {
      console.error("Error starting session:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const todaySessions = sessions.filter((session) => {
    const sessionDate = new Date(session.scheduled_datetime).toDateString()
    const today = new Date().toDateString()
    return sessionDate === today
  })

  const upcomingSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.scheduled_datetime)
    const today = new Date()
    return sessionDate > today && ["scheduled", "confirmed"].includes(session.status)
  })

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <header className="bg-card shadow-sm border-b transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dr. {user.first_name || user.username}</h1>
              <p className="text-gray-600">Panel de Terapeuta</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Sessions */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sesiones de Hoy</h2>
              {todaySessions.length > 0 ? (
                <div className="space-y-4">
                  {todaySessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{session.patient_name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(session.scheduled_datetime).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                              session.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : session.status === "scheduled"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {session.status_display}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {session.status === "scheduled" && (
                            <>
                              <Button size="small" onClick={() => handleConfirmSession(session.id)}>
                                Confirmar
                              </Button>
                              <Button size="small" variant="outline" onClick={() => handleCancelSession(session.id)}>
                                Cancelar
                              </Button>
                            </>
                          )}
                          {session.status === "confirmed" && (
                            <Button size="small" onClick={() => handleStartSession(session.id)}>
                              Iniciar Sesión
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No tienes sesiones programadas para hoy</p>
              )}
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Sesiones</h2>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{session.patient_name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(session.scheduled_datetime).toLocaleString("es-ES")}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                              session.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {session.status_display}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {session.status === "scheduled" && (
                            <>
                              <Button size="small" onClick={() => handleConfirmSession(session.id)}>
                                Confirmar
                              </Button>
                              <Button size="small" variant="outline" onClick={() => handleCancelSession(session.id)}>
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No tienes sesiones próximas</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total sesiones:</span>
                  <span className="font-medium">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completadas:</span>
                  <span className="font-medium text-green-600">
                    {sessions.filter((s) => s.status === "completed").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pendientes:</span>
                  <span className="font-medium text-yellow-600">
                    {sessions.filter((s) => ["scheduled", "confirmed"].includes(s.status)).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Canceladas:</span>
                  <span className="font-medium text-red-600">
                    {sessions.filter((s) => s.status === "cancelled").length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Ver Calendario Completo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Actualizar Disponibilidad
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Ver Historial de Pacientes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TherapistDashboard
