# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a teletherapy platform with a Django REST API backend and dual frontend options:
- **Primary Backend**: Django with DRF, JWT authentication, PostgreSQL
- **Next.js Frontend**: Root-level Next.js application with Shadcn/UI components
- **React/Vite Frontend**: Alternative frontend in `frontend/` directory

### Core Applications
- `accounts`: User management with Patient/Therapist roles, custom User model
- `sessions`: Session scheduling, video calls via Jitsi, messaging
- `settings`: User preferences and configuration

### Key Models
- `User`: Extended AbstractUser with roles (paciente/terapeuta/admin)
- `Patient`: Profile with initial test results, anxiety/depression levels
- `Therapist`: Profile with specialties, availability, ratings
- `Session`: Therapy sessions with Jitsi video links, notes, feedback
- `Message`: In-session messaging system

## Development Commands

### Backend (Django)
```bash
cd backend
python manage.py runserver          # Development server
python manage.py migrate            # Apply migrations
python manage.py createsuperuser    # Create admin user
python manage.py makemigrations     # Create migrations
```

### Frontend Options

**Next.js (Root)**:
```bash
pnpm dev                            # Development server
pnpm build                          # Production build
pnpm lint                           # ESLint
```

**React/Vite (frontend/)**:
```bash
cd frontend
npm run dev                         # Development server
npm run build                       # Production build
npm run lint                        # ESLint
```

### Docker Development
```bash
cd backend
docker-compose -f bruno-docker-compose.yml up --build
```

## Environment Configuration

Backend requires these environment variables:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`
- `JITSI_DOMAIN`: Video call domain (default: meet.jit.si)

## API Architecture

- JWT authentication with access/refresh tokens
- CORS configured for local development (ports 3000, 5173)
- Custom pagination (20 items per page)
- Uses drf-yasg for API documentation

## Frontend Architecture

**Next.js**: Modern React with TypeScript, Tailwind CSS, Radix UI components
**React/Vite**: Legacy frontend with Headless UI, Framer Motion, React Router

Both frontends communicate with Django backend at `http://localhost:8000`.

## Key Integration Points

- Video sessions use Jitsi Meet with auto-generated room names
- User roles determine access to different dashboard views
- Session status flow: scheduled → confirmed → in_progress → completed
- Real-time messaging within therapy sessions

### Instructions.
0. ALWAYS Talk to me in spanish
1. First, analyze the problem, read the base code to find relevant files, and write a plan in task/todo.md.
2. The plan should include a list of pending tasks that you can mark as you complete them.
3. Before starting to work, contact me and I will verify the plan.
4. Then, start working on the pending tasks, marking them as completed as you progress.
5. Please, at each step of the process, simply give me a detailed explanation of the changes you made.
6. Simplify each task and code change to the maximum. We want to avoid massive or complex changes. Each change should affect the least amount of code possible. Everything is based on simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.