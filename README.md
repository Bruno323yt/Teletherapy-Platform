# Teletherapy Platform

Este proyecto es una plataforma de teleterapia que combina un **backend en Django** y un **frontend en React** para facilitar las sesiones en línea entre pacientes y terapeutas. Incluye autenticación con JWT, gestión de sesiones, mensajería, configuraciones de usuario y un entorno de desarrollo con Docker.

## Características principales

- Registro e inicio de sesión de usuarios con roles de **paciente** o **terapeuta**.
- Gestión de perfiles de pacientes y terapeutas.
- Programación y seguimiento de sesiones de terapia.
- Mensajería dentro de las sesiones.
- Configuración personalizable de notificaciones, privacidad y dispositivos.
- Integración con Jitsi para videollamadas (configurable mediante la variable `JITSI_DOMAIN`).

## Estructura del repositorio

- `backend/` – Proyecto Django con las aplicaciones `accounts`, `sessions` y `settings`.
- `frontend/` – Aplicación React basada en Vite.
- Archivos en la raíz (`package.json`, `pnpm-lock.yaml`) – Configuración de un proyecto con Next.js que puede usarse como frontend alternativo.
- `public/` – Recursos estáticos como imágenes de ejemplo.

## Requisitos

- Python 3.11
- Node.js 18 o superior
- PostgreSQL (local o en contenedor)
- [Opcional] Docker y Docker Compose para un entorno de desarrollo rápido.

## Puesta en marcha del backend

1. Instalar dependencias:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configurar variables de entorno (pueden colocarse en un archivo `.env`):
   - `SECRET_KEY`
   - `DEBUG`
   - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`
   - `JITSI_DOMAIN`
3. Ejecutar migraciones y crear superusuario:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

También es posible utilizar `bruno-docker-compose.yml` para levantar una base de datos PostgreSQL y el servicio de Django con Docker.

## Puesta en marcha del frontend

### Opción 1: Aplicación Next.js (carpeta raíz)

1. Instalar dependencias:
   ```bash
   pnpm install
   # o npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   pnpm dev
   # o npm run dev
   ```

### Opción 2: Aplicación React + Vite (`frontend/`)

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Ambas aplicaciones se comunican con el backend mediante peticiones HTTP (por defecto en `http://localhost:8000`).

## Docker

El directorio `backend` incluye un `Dockerfile` y un archivo `bruno-docker-compose.yml` que crean un contenedor con Django y PostgreSQL. Para iniciar todo con Docker:

```bash
cd backend
docker-compose -f bruno-docker-compose.yml up --build
```

Esto compilará la imagen del backend, instalará dependencias, aplicará migraciones y levantará los servicios necesarios.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.

