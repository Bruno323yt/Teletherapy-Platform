import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import { AuthProvider } from "./contexts/AuthContext"
import { useAuth } from "./contexts/AuthContext"
import { ThemeProvider } from "../components/theme-provider"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PatientDashboard from "./pages/PatientDashboard"
import TherapistDashboard from "./pages/TherapistDashboard"
import InitialTest from "./pages/InitialTest"
import SessionRoom from "./pages/SessionRoom"
import Settings from "./pages/Settings"
import { LoadingSpinner } from "../components/ui"

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>{user?.role === "paciente" ? <PatientDashboard /> : <TherapistDashboard />}</ProtectedRoute>
        }
      />

      <Route
        path="/initial-test"
        element={
          <ProtectedRoute allowedRoles={["paciente"]}>
            <InitialTest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/session/:sessionId"
        element={
          <ProtectedRoute>
            <SessionRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router future={{ v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <AppRoutes />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
