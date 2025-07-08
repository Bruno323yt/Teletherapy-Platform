# Configuración del Backend para App Móvil

## ✅ Cambios Realizados

### 1. CORS Configuration
```python
# Orígenes permitidos para desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",      # Next.js
    "http://127.0.0.1:3000",     
    "http://localhost:5173",      # Vite React
    "http://127.0.0.1:5173",     
    "http://localhost:19006",     # Expo web
    "http://127.0.0.1:19006",
    "http://localhost:8081",      # Expo development server
    "http://127.0.0.1:8081",
]

# Patrones regex para IPs dinámicas de Expo
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://192\.168\.\d+\.\d+:19006$",    # Red local
    r"^http://10\.\d+\.\d+\.\d+:19006$",     # Otras redes
    r"^http://172\.\d+\.\d+\.\d+:19006$",    # Docker networks
]
```

### 2. JWT Token Blacklist
```python
INSTALLED_APPS = [
    # ...
    'rest_framework_simplejwt.token_blacklist',
]

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

### 3. Nuevos Endpoints

#### Auth Endpoints
- ✅ `POST /api/auth/login/` - Login con JWT
- ✅ `POST /api/auth/register/` - Registro de usuarios
- ✅ `POST /api/auth/logout/` - Logout con blacklist de tokens
- ✅ `POST /api/auth/token/refresh/` - Refresh de tokens
- ✅ `GET /api/auth/profile/` - Perfil de usuario
- ✅ `PATCH /api/auth/profile/update/` - Actualizar perfil

#### Sessions Endpoints
- ✅ `GET /api/sessions/` - Lista general de sesiones
- ✅ `GET /api/sessions/patient/` - Sesiones específicas de paciente
- ✅ `GET /api/sessions/therapist/` - Sesiones específicas de terapeuta
- ✅ `GET /api/sessions/{id}/` - Detalle de sesión
- ✅ `GET /api/sessions/{id}/messages/` - Mensajes de sesión
- ✅ `POST /api/sessions/{id}/messages/` - Enviar mensaje

### 4. Views Añadidas

```python
# sessions/views.py
class PatientSessionsView(generics.ListAPIView):
    """Sesiones filtradas por paciente autenticado"""
    
class TherapistSessionsView(generics.ListAPIView):
    """Sesiones filtradas por terapeuta autenticado"""

# accounts/views.py
@api_view(['POST'])
def logout_view(request):
    """Logout con invalidación de refresh token"""
```

## 🔄 Migración Requerida

Después de estos cambios, ejecuta:
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## 🧪 Testing de Endpoints

### 1. Registro
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "role": "paciente"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### 3. Sesiones (con token)
```bash
curl -X GET http://localhost:8000/api/sessions/patient/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📱 Compatibilidad Mobile

### Expo Development
- ✅ Soporte para Expo Go (`localhost:19006`)
- ✅ Soporte para tunnel/LAN (`192.168.x.x:19006`)
- ✅ Headers CORS apropiados para mobile

### Producción
Para producción, actualiza:
```python
CORS_ALLOW_ALL_ORIGINS = False  # Solo en desarrollo
CORS_ALLOWED_ORIGINS = [
    "https://tu-app-web.com",
    "https://tu-app-mobile.com"
]
```

## 🔒 Seguridad

### JWT Security
- Tokens de acceso: 60 minutos
- Tokens de refresh: 7 días
- Rotación automática de refresh tokens
- Blacklist de tokens al logout

### CORS Security
- Solo orígenes específicos en producción
- Credenciales permitidas para cookies/auth
- Headers apropiados para APIs REST

## 🐛 Troubleshooting

### Error de CORS
```javascript
// Verificar que la URL base sea correcta
const API_BASE_URL = 'http://localhost:8000'  // Para desarrollo
```

### Error 401 en requests
```javascript
// Verificar headers de autorización
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

### Error de conexión mobile
```bash
# Verificar IP de la red local
ipconfig getifaddr en0  # macOS
ip route get 1 | awk '{print $7}' # Linux

# Actualizar API_BASE_URL en shared/constants.ts
export const API_BASE_URL = 'http://192.168.1.100:8000'
```

## ✅ Estado del Backend

El backend Django está **completamente configurado** para:
- ✅ App móvil React Native con Expo
- ✅ Frontend Next.js en puerto 3000  
- ✅ Frontend React/Vite en puerto 5173
- ✅ Desarrollo en red local/túnel
- ✅ Autenticación JWT completa
- ✅ APIs REST para teleterapia

**¡El backend está listo para testing con la app móvil!**