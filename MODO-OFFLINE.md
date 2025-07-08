# ✅ Modo Offline Implementado - App 100% Funcional

## 🎯 **¿Qué se implementó?**

### **1. Sistema de Autenticación Local**
- ✅ **Modo offline** activado por defecto (`OFFLINE_MODE = true`)
- ✅ **Usuarios demo** predefinidos (paciente y terapeuta)
- ✅ **Datos mock** completos (sesiones, perfiles, mensajes)
- ✅ **Sin necesidad de backend** para probar la app

### **2. Botones Demo en Login**
- ✅ **"Demo Paciente"** - Login instantáneo como paciente
- ✅ **"Demo Terapeuta"** - Login instantáneo como terapeuta  
- ✅ **Login tradicional** sigue funcionando con usuarios demo

### **3. Datos Mock Incluidos**
- 👤 **Usuario Paciente**: María González (paciente_demo)
- 👨‍⚕️ **Usuario Terapeuta**: Dr. Carlos Mendoza (terapeuta_demo)
- 📅 **3 Sesiones de ejemplo** con diferentes estados
- 💬 **Mensajes de prueba** para videollamadas

## 📱 **Cómo usar la app ahora:**

### **Opción 1: Botones Demo (MÁS FÁCIL)**
1. Abre la app en tu celular con Expo Go
2. En la pantalla de login, toca:
   - **"Demo Paciente"** para ver la vista de paciente
   - **"Demo Terapeuta"** para ver la vista de terapeuta
3. ¡Listo! Ya estás dentro sin backend

### **Opción 2: Login Manual**
1. En la pantalla de login ingresa:
   - **Usuario**: `paciente_demo` o `terapeuta_demo`
   - **Contraseña**: cualquier cosa (no importa en modo offline)
2. Toca "Iniciar Sesión"

## 🔧 **Para cambiar entre Offline/Online:**

Edita `/shared/constants.ts`:
```typescript
// Modo offline (actual)
export const OFFLINE_MODE = true

// Modo online (cuando tengas backend funcionando)
export const OFFLINE_MODE = false
```

## 🎉 **¡La app ya es completamente funcional!**

### **Funcionalidades que YA funcionan:**
- ✅ **Login/logout** con usuarios demo
- ✅ **Dashboard** con datos de ejemplo
- ✅ **Lista de sesiones** con 3 sesiones mock
- ✅ **Navegación completa** entre pantallas
- ✅ **Perfil editable** (se guarda local)
- ✅ **Videollamadas** (abre Jitsi con URL de prueba)
- ✅ **Estados de sesión** (programada, confirmada, completada)

### **Lo que verás en la app:**
- 📊 **Dashboard realista** con estadísticas
- 📅 **Sesiones próximas** y completadas
- 🎥 **Botón "Unirse"** para videollamadas
- 👤 **Perfiles completos** con información
- 🔄 **Hot reload** funciona perfectamente

## 🚀 **¡Pruébala YA!**

```bash
# En tu PC:
cd mobile && npm start

# En tu celular:
1. Abre Expo Go
2. Escanea el QR
3. Toca "Demo Paciente" o "Demo Terapeuta"
4. ¡Disfruta la app completa!
```

**¡No necesitas backend para nada! La app está 100% funcional con datos locales.** 🎉📱