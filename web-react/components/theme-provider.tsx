'use client'

import * as React from 'react'
import { useAuth } from '../src/contexts/AuthContext'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const { user } = useAuth()
  
  // Inicialización: si hay tema de usuario, úsalo y guárdalo en localStorage
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (user?.theme) {
      localStorage.setItem(storageKey, user.theme)
      return user.theme as Theme
    }
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme
  })

  // Cuando cambia el usuario, sincroniza el tema y localStorage
  React.useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      localStorage.setItem(storageKey, user.theme)
      setTheme(user.theme as Theme)
    }
  }, [user?.theme])

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      console.log('Theme applied (system):', systemTheme)
      return
    }

    root.classList.add(theme)
    console.log('Theme applied:', theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
