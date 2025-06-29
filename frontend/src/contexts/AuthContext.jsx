"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile/")
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      })

      const { user, access, refresh } = response.data

      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Error al iniciar sesión",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register/", userData)
      const { user, access, refresh } = response.data

      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Error al registrarse",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }))
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    fetchProfile,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
