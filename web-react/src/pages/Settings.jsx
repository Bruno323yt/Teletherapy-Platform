import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useAppTheme } from "../../hooks/useAppTheme"
import api from "../services/api"
import AppHeader from "../../components/layout/AppHeader"
import { Button, Card, CardHeader, CardContent, CardTitle, Badge, Modal, LoadingSpinner, Alert } from "../../components/ui"
import { UserCircleIcon, BellIcon, ShieldCheckIcon, DevicePhoneMobileIcon, CameraIcon, MicrophoneIcon, SpeakerWaveIcon, GlobeAltIcon, PaintBrushIcon, DocumentTextIcon, TrashIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

function Settings() {
  const { user, updateUser } = useAuth()
  const { setTheme } = useAppTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  // Form states
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    timezone: '',
    language: 'es',
    bio: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    session_reminders: true,
    appointment_confirmations: true,
    newsletter: false,
    marketing: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'private',
    data_sharing: false,
    analytics: true,
    third_party: false
  })

  const [deviceSettings, setDeviceSettings] = useState({
    camera_enabled: true,
    microphone_enabled: true,
    speaker_enabled: true,
    preferred_quality: 'auto'
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const [profileRes, settingsRes] = await Promise.all([
        api.get("/auth/profile/"),
        api.get("/settings/")
      ])

      const profile = profileRes.data
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.profile?.date_of_birth || '',
        gender: profile.profile?.gender || '',
        timezone: profile.profile?.timezone || 'America/Mexico_City',
        language: profile.profile?.language || 'es',
        bio: profile.profile?.bio || ''
      })

      if (settingsRes.data) {
        setNotificationSettings({
          email_notifications: settingsRes.data.email_notifications,
          sms_notifications: settingsRes.data.sms_notifications,
          push_notifications: settingsRes.data.push_notifications,
          session_reminders: settingsRes.data.session_reminders,
          appointment_confirmations: settingsRes.data.appointment_confirmations,
          newsletter: settingsRes.data.newsletter,
          marketing: settingsRes.data.marketing
        })
        
        setPrivacySettings({
          profile_visibility: settingsRes.data.profile_visibility,
          data_sharing: settingsRes.data.data_sharing,
          analytics: settingsRes.data.analytics,
          third_party: settingsRes.data.third_party
        })
        
        setDeviceSettings({
          camera_enabled: settingsRes.data.camera_enabled,
          microphone_enabled: settingsRes.data.microphone_enabled,
          speaker_enabled: settingsRes.data.speaker_enabled,
          preferred_quality: settingsRes.data.preferred_quality
        })
        
        if (settingsRes.data.theme) {
          setProfileData(prev => ({ ...prev, theme: settingsRes.data.theme }))
          setTheme(settingsRes.data.theme)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Si hay error, al menos mostrar la información del usuario actual
      if (user) {
        setProfileData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          date_of_birth: '',
          gender: '',
          timezone: 'America/Mexico_City',
          language: 'es',
          bio: ''
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // Solo enviar los campos editables del perfil
      const profileUpdateData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio
      }
      
      await api.put("/auth/profile/update/", profileUpdateData)
      updateUser({ ...user, ...profileUpdateData })
      alert('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async (type, data) => {
    setSaving(true)
    try {
      await api.put("/settings/update/", { [type]: data })
      
      // Mostrar mensaje de éxito
      alert(`${type === 'notifications' ? 'Notificaciones' : type === 'privacy' ? 'Privacidad' : type === 'device' ? 'Dispositivo' : 'Configuración'} guardada exitosamente`)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTheme = async () => {
    setSaving(true)
    try {
      console.log('handleSaveTheme - saving theme:', profileData.theme)
      await api.put("/auth/profile/update/", { theme: profileData.theme })
      updateUser({ ...user, theme: profileData.theme })
      setTheme(profileData.theme)
      console.log('handleSaveTheme - theme saved and applied')
      alert('Tema actualizado exitosamente')
    } catch (error) {
      console.error('Error saving theme:', error)
      alert('Error al actualizar el tema')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      // Show error: passwords don't match
      return
    }

    setSaving(true)
    try {
      await api.post("/auth/change-password/", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      setShowPasswordModal(false)
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      // Show success message
    } catch (error) {
      console.error('Error changing password:', error)
      // Show error message
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setSaving(true)
    try {
      await api.delete("/auth/delete-account/")
      // Redirect to logout
    } catch (error) {
      console.error('Error deleting account:', error)
      // Show error message
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <AppHeader title="Configuración" />
      
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Configuración</h1>
            <p className="text-neutral-600 mt-2">Gestiona tu perfil, notificaciones y preferencias</p>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 mb-8">
            <div className="border-b border-neutral-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', name: 'Perfil', icon: UserCircleIcon },
                  { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
                  { id: 'privacy', name: 'Privacidad', icon: ShieldCheckIcon },
                  { id: 'device', name: 'Dispositivo', icon: DevicePhoneMobileIcon },
                  { id: 'appearance', name: 'Apariencia', icon: PaintBrushIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card className="bg-white border border-neutral-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-none">
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <p className="text-sm text-neutral-600">
                      Actualiza tu información personal y de contacto
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={profileData.first_name}
                          onChange={e => setProfileData({...profileData, first_name: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:border-neutral-700 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Apellido</label>
                        <input
                          type="text"
                          value={profileData.last_name}
                          onChange={e => setProfileData({...profileData, last_name: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:border-neutral-700 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={e => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:border-neutral-700 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={e => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:border-neutral-700 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Biografía</label>
                      <textarea
                        value={profileData.bio}
                        onChange={e => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:border-neutral-700 transition-colors"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                        Cambiar Contraseña
                      </Button>
                      <Button onClick={handleSaveProfile} loading={saving} className="px-6">
                        Guardar Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <Card className="bg-white border border-neutral-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-none">
                  <CardHeader>
                    <CardTitle>Notificaciones</CardTitle>
                    <p className="text-sm text-neutral-600">
                      Configura cómo y cuándo recibir notificaciones
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Notificaciones por email</h4>
                          <p className="text-sm text-neutral-600">Recibir notificaciones por correo electrónico</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_notifications}
                          onChange={e => setNotificationSettings({...notificationSettings, email_notifications: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Notificaciones push</h4>
                          <p className="text-sm text-neutral-600">Recibir notificaciones en el navegador</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.push_notifications}
                          onChange={e => setNotificationSettings({...notificationSettings, push_notifications: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Recordatorios de sesión</h4>
                          <p className="text-sm text-neutral-600">Recordatorios antes de las sesiones</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.session_reminders}
                          onChange={e => setNotificationSettings({...notificationSettings, session_reminders: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSaveSettings('notifications', notificationSettings)}
                        loading={saving}
                        className="px-6"
                      >
                        Guardar Notificaciones
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <Card className="bg-white border border-neutral-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-none">
                  <CardHeader>
                    <CardTitle>Privacidad</CardTitle>
                    <p className="text-sm text-neutral-600">
                      Controla la visibilidad de tu perfil y el uso de tus datos
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Visibilidad del perfil</h4>
                          <p className="text-sm text-neutral-600">Quién puede ver tu perfil</p>
                        </div>
                        <select
                          value={privacySettings.profile_visibility}
                          onChange={e => setPrivacySettings({...privacySettings, profile_visibility: e.target.value})}
                          className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 transition-colors"
                        >
                          <option value="private">Privado</option>
                          <option value="public">Público</option>
                          <option value="therapists">Solo terapeutas</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Compartir datos</h4>
                          <p className="text-sm text-neutral-600">Permitir compartir datos con terceros</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings.data_sharing}
                          onChange={e => setPrivacySettings({...privacySettings, data_sharing: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Analíticas</h4>
                          <p className="text-sm text-neutral-600">Permitir el uso de datos para mejorar el servicio</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings.analytics}
                          onChange={e => setPrivacySettings({...privacySettings, analytics: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">Terceros</h4>
                          <p className="text-sm text-neutral-600">Permitir acceso a integraciones de terceros</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings.third_party}
                          onChange={e => setPrivacySettings({...privacySettings, third_party: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSaveSettings('privacy', privacySettings)}
                        loading={saving}
                        className="px-6"
                      >
                        Guardar Privacidad
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Device Tab */}
              {activeTab === 'device' && (
                <Card className="bg-white border border-neutral-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-none">
                  <CardHeader>
                    <CardTitle>Configuración del Dispositivo</CardTitle>
                    <p className="text-sm text-neutral-600">
                      Configura los dispositivos de audio y video para las sesiones
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CameraIcon className="h-5 w-5 text-neutral-600" />
                          <div>
                            <h4 className="font-medium text-neutral-900">Cámara</h4>
                            <p className="text-sm text-neutral-600">Permitir acceso a la cámara</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={deviceSettings.camera_enabled}
                          onChange={e => setDeviceSettings({...deviceSettings, camera_enabled: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MicrophoneIcon className="h-5 w-5 text-neutral-600" />
                          <div>
                            <h4 className="font-medium text-neutral-900">Micrófono</h4>
                            <p className="text-sm text-neutral-600">Permitir acceso al micrófono</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={deviceSettings.microphone_enabled}
                          onChange={e => setDeviceSettings({...deviceSettings, microphone_enabled: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <SpeakerWaveIcon className="h-5 w-5 text-neutral-600" />
                          <div>
                            <h4 className="font-medium text-neutral-900">Altavoces</h4>
                            <p className="text-sm text-neutral-600">Permitir acceso a los altavoces</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={deviceSettings.speaker_enabled}
                          onChange={e => setDeviceSettings({...deviceSettings, speaker_enabled: e.target.checked})}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSaveSettings('device', deviceSettings)}
                        loading={saving}
                        className="px-6"
                      >
                        Guardar Dispositivo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <Card className="bg-white border border-neutral-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-none">
                  <CardHeader>
                    <CardTitle>Apariencia</CardTitle>
                    <p className="text-sm text-neutral-600">
                      Personaliza el tema y la apariencia de la plataforma
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">Tema</h4>
                        <p className="text-sm text-neutral-600">Elige entre claro, oscuro o automático</p>
                        <p className="text-xs text-neutral-500 mt-1">Tema actual: {profileData.theme || 'auto'}</p>
                      </div>
                      <select
                        value={profileData.theme || 'auto'}
                        onChange={e => setProfileData({...profileData, theme: e.target.value})}
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 transition-colors"
                      >
                        <option value="auto">Automático</option>
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveTheme}
                        loading={saving}
                        className="px-6"
                      >
                        Guardar Apariencia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Zona de Peligro</CardTitle>
              <p className="text-sm text-red-600">
                Acciones irreversibles que afectarán tu cuenta
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-800">Eliminar cuenta</h4>
                  <p className="text-sm text-red-600">Elimina permanentemente tu cuenta y todos tus datos</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Eliminar Cuenta</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Contraseña actual</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-neutral-400"
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                >
                  {showPasswords.current ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-neutral-400"
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                >
                  {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Confirmar nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirm_password}
                  onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-neutral-400"
                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                >
                  {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} loading={saving} className="px-6">
                Cambiar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Eliminar Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-neutral-700">¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount} loading={saving}>
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </>
  )
}

export default Settings 