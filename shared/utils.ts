import { JITSI_CONFIG } from './constants'

export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const generateJitsiRoomName = (sessionId: string): string => {
  return `${JITSI_CONFIG.ROOM_PREFIX}${sessionId}`
}

export const generateJitsiUrl = (sessionId: string): string => {
  const roomName = generateJitsiRoomName(sessionId)
  return `https://${JITSI_CONFIG.DOMAIN}/${roomName}`
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // Mínimo 8 caracteres, al menos una letra y un número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  return passwordRegex.test(password)
}

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const getSessionStatusColor = (status: string): string => {
  switch (status) {
    case 'scheduled':
      return '#3B82F6' // blue
    case 'confirmed':
      return '#10B981' // green
    case 'in_progress':
      return '#F59E0B' // yellow
    case 'completed':
      return '#6B7280' // gray
    case 'cancelled':
      return '#EF4444' // red
    default:
      return '#6B7280'
  }
}

export const getSessionStatusText = (status: string): string => {
  switch (status) {
    case 'scheduled':
      return 'Programada'
    case 'confirmed':
      return 'Confirmada'
    case 'in_progress':
      return 'En progreso'
    case 'completed':
      return 'Completada'
    case 'cancelled':
      return 'Cancelada'
    default:
      return 'Desconocido'
  }
}