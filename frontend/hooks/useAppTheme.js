import { useEffect } from 'react'
import { useAuth } from '../src/contexts/AuthContext'
import { useTheme } from '../components/theme-provider'

export function useAppTheme() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  // Sincronizar el tema del usuario con el ThemeProvider
  useEffect(() => {
    console.log('useAppTheme - user theme:', user?.theme, 'current theme:', theme)
    if (user?.theme && user.theme !== theme) {
      console.log('useAppTheme - syncing theme from user:', user.theme)
      setTheme(user.theme)
    }
  }, [user?.theme, theme, setTheme])

  return { theme, setTheme }
} 