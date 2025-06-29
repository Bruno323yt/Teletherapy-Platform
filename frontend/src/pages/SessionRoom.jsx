import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { Button, Card, LoadingSpinner } from "../../components/ui"

function SessionRoom() {
  const { sessionId } = useParams()
  const { user } = useAuth()
  const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchSessionData()
    const interval = setInterval(fetchMessages, 3000) // Poll for new messages
    return () => clearInterval(interval)
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchSessionData = async () => {
    try {
      const [sessionRes, messagesRes] = await Promise.all([
        api.get(`/sessions/${sessionId}/`),
        api.get(`/sessions/${sessionId}/messages/`),
      ])
      setSession(sessionRes.data)
      setMessages(messagesRes.data.results || messagesRes.data)
    } catch (error) {
      console.error("Error fetching session data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}/messages/`)
      setMessages(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await api.post(`/sessions/${sessionId}/messages/`, {
        content: newMessage,
      })
      setNewMessage("")
      fetchMessages()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const openVideoCall = () => {
    if (session?.video_link) {
      window.open(session.video_link, "_blank")
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-red-600">Sesión no encontrada</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <header className="bg-card shadow-sm border-b transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sesión de Terapia</h1>
              <p className="text-gray-600">
                {user.role === "paciente" ? `Con ${session.therapist_name}` : `Con ${session.patient_name}`}
              </p>
            </div>
            <div className="flex space-x-4">
              {session.video_link && <Button onClick={openVideoCall}>Unirse a Videollamada</Button>}
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  session.status === "in_progress" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {session.status_display}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Call Area */}
          <div className="lg:col-span-2">
            <Card>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                {session.video_link ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Videollamada Lista</h3>
                    <p className="text-gray-600 mb-4">Haz clic en el botón de arriba para unirte a la videollamada</p>
                    <Button onClick={openVideoCall}>Unirse Ahora</Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Esperando Confirmación</h3>
                    <p className="text-gray-600">
                      La videollamada estará disponible cuando el terapeuta confirme la sesión
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div>
            <Card className="h-96 flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chat de la Sesión</h3>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === user.id ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${message.sender === user.id ? "text-primary-100" : "text-gray-500"}`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button type="submit" size="small">
                  Enviar
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Session Info */}
        <div className="mt-8">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Sesión</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha y Hora</p>
                <p className="font-medium">{new Date(session.scheduled_datetime).toLocaleString("es-ES")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duración</p>
                <p className="font-medium">{session.duration_minutes} minutos</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium">{session.status_display}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SessionRoom
