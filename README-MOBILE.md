# Configuración de App React Native - Plataforma de Teleterapia

Este proyecto ahora incluye una aplicación móvil React Native usando Expo, organizada como monorepo junto con los frontends web existentes.

## Estructura del Proyecto

```
├── backend/              # API Django REST
├── web-nextjs/          # Frontend Next.js con Shadcn/UI
├── web-react/           # Frontend React/Vite con Headless UI
├── mobile/              # App React Native con Expo
├── shared/              # Código compartido (tipos, utils, API)
└── package.json         # Configuración del workspace
```

## Requisitos Previos

### Para Desarrollo General
- Node.js 18+ 
- npm o pnpm
- Python 3.9+ (para backend Django)

### Para Desarrollo Mobile en Linux
- Android Studio (para emulador) O dispositivo Android físico
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app en tu dispositivo Android

## Configuración Inicial

### 1. Instalar Dependencias
```bash
# Instalar dependencias del workspace
npm install

# Instalar dependencias de cada proyecto
cd web-nextjs && npm install
cd ../web-react && npm install  
cd ../mobile && npm install
cd ../shared && npm install
```

### 2. Configurar Backend Django
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Comandos de Desarrollo

### Ejecutar Todo el Stack
```bash
# Desde la raíz del proyecto
npm run dev  # Ejecuta web-nextjs, web-react y mobile en paralelo
```

### Comandos Individuales
```bash
# Solo frontend Next.js
npm run dev:web-nextjs

# Solo frontend React/Vite  
npm run dev:web-react

# Solo app mobile
npm run dev:mobile
# O directamente:
cd mobile && npm start
```

### Comandos Mobile Específicos
```bash
cd mobile

# Desarrollo general (muestra QR)
npm start

# Para dispositivo Android conectado por USB
npm run android

# Con túnel (para testing en red)
npm run tunnel

# Linting
npm run lint

# Limpiar cache
npm run clear
```

## Testing en Dispositivo Android Físico

### Opción 1: Expo Go (Recomendado para empezar)
1. Instala Expo Go desde Google Play Store
2. Ejecuta `cd mobile && npm start`
3. Escanea el QR code con Expo Go
4. La app se cargará en tu dispositivo

### Opción 2: USB Debug
1. Habilita "Opciones de desarrollador" en Android
2. Activa "Depuración USB"
3. Conecta tu dispositivo por USB
4. Ejecuta `cd mobile && npm run android`

### Opción 3: Túnel (Para redes complejas)
```bash
cd mobile && npm run tunnel
```

## Estructura de la App Mobile

### Navegación
- **AuthNavigator**: Login y Registro
- **MainNavigator**: Tabs principales (Dashboard, Sesiones, Perfil)
- **Stack Navigation**: Para pantallas modales como VideoCall

### Pantallas Principales
- **LoginScreen**: Autenticación de usuarios
- **RegisterScreen**: Registro de nuevos usuarios (paciente/terapeuta)
- **DashboardScreen**: Vista principal con resumen
- **SessionsScreen**: Lista de sesiones programadas
- **VideoCallScreen**: Videollamadas usando Jitsi Meet
- **ProfileScreen**: Perfil de usuario editable

### Estado Global
- **Zustand**: Para manejo de estado de autenticación
- **AsyncStorage**: Persistencia de tokens y datos de usuario

### API Integration
- Compartida con frontends web a través de `/shared`
- Cliente HTTP con interceptors para refresh de tokens
- Endpoints completos para todas las funcionalidades

## Configuración de CORS (Backend)

Asegúrate de que el backend Django tenga configurado CORS para desarrollo mobile:

```python
# backend/teletherapy/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js
    "http://localhost:5173",  # Vite
    "http://localhost:19006", # Expo web
]

CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo
```

## Videollamadas

La app mobile usa Jitsi Meet a través de WebView para las videollamadas:
- URL generada automáticamente por sesión
- Integración completa con el backend
- Soporte para audio/video en dispositivos móviles

## Troubleshooting

### Error de red en Expo
```bash
# Reinicia el servidor con cache limpio
cd mobile && npm run clear
```

### Problemas de autenticación
- Verifica que el backend esté corriendo en `localhost:8000`
- Revisa la configuración de CORS
- Limpia AsyncStorage: reinstala la app

### Dependencias
```bash
# Si hay problemas con dependencias
cd mobile
rm -rf node_modules package-lock.json
npm install
```

### Android Studio/Emulador
```bash
# Verificar dispositivos conectados
adb devices

# Reiniciar ADB
adb kill-server && adb start-server
```

## Próximos Pasos

1. **Push Notifications**: Implementar notificaciones para citas
2. **Offline Support**: Cache de datos para uso sin conexión  
3. **Biometría**: Autenticación con huella dactilar
4. **Grabación**: Funcionalidad de grabación de sesiones
5. **Chat Real-time**: WebSockets para mensajería instantánea

## Comandos Útiles

```bash
# Ver logs en tiempo real
cd mobile && npx expo logs

# Construcción para producción
cd mobile && npm run build:android

# Ver info del proyecto
cd mobile && npx expo doctor
```

## Soporte

- [Documentación Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Jitsi Meet](https://jitsi.github.io/handbook/)

¡La app móvil está lista para desarrollo y testing en dispositivos Android físicos!