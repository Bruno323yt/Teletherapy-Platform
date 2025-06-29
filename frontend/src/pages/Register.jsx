"use client"

import { useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import Input from "../components/Input"
import { Card } from "../../components/ui"

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    role: "paciente",
    phone: "",
    date_of_birth: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const result = await register(formData)

    if (!result.success) {
      setErrors(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Únete a nuestra plataforma de teleterapia</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.non_field_errors && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.non_field_errors}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name?.[0]}
                required
              />

              <Input
                label="Apellido"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name?.[0]}
                required
              />
            </div>

            <Input
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username?.[0]}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field" required>
                <option value="paciente">Paciente</option>
                <option value="terapeuta">Terapeuta</option>
              </select>
            </div>

            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone?.[0]}
            />

            <Input
              label="Fecha de Nacimiento"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={errors.date_of_birth?.[0]}
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password?.[0]}
              required
            />

            <Input
              label="Confirmar Contraseña"
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              error={errors.password_confirm?.[0]}
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register
