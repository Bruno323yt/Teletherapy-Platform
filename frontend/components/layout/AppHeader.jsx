import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../src/contexts/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../lib/cn';

const AppHeader = ({ 
  title, 
  subtitle, 
  notifications = 0,
  onNotificationClick,
  className 
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = user?.role || 'patient';
  const displayName = user?.first_name 
    ? `${userRole === 'therapist' ? 'Dr. ' : ''}${user.first_name}` 
    : user?.username;

  const navigationItems = [
    { name: 'Dashboard', href: '/', current: true },
    ...(userRole === 'patient' 
      ? [
          { name: 'Mis Sesiones', href: '/sessions' },
          { name: 'Terapeutas', href: '/therapists' },
          { name: 'Mi Progreso', href: '/progress' },
        ]
      : [
          { name: 'Calendario', href: '/calendar' },
          { name: 'Pacientes', href: '/patients' },
          { name: 'Reportes', href: '/reports' },
        ]
    ),
  ];

  return (
    <header className={cn(
      'bg-card border-b border-border shadow-sm sticky top-0 z-40',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-neutral-600 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  item.current
                    ? 'text-primary-600 border-b-2 border-primary-500 pb-1'
                    : 'text-muted-foreground hover:text-primary-600'
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            {notifications > 0 && (
              <button
                onClick={onNotificationClick}
                className="relative p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <BellIcon className="h-6 w-6" />
                <Badge 
                  variant="danger" 
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                >
                  {notifications > 99 ? '99+' : notifications}
                </Badge>
              </button>
            )}

            {/* Menú del usuario - Desktop */}
            <Menu as="div" className="relative hidden md:block">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                <UserCircleIcon className="h-8 w-8 text-neutral-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-neutral-500 capitalize">
                    {userRole === 'therapist' ? 'Terapeuta' : 'Paciente'}
                  </p>
                </div>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-modal border border-border py-1 z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={cn(
                          'flex items-center px-4 py-2 text-sm',
                          active ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        <UserCircleIcon className="h-4 w-4 mr-3" />
                        Mi Perfil
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/settings"
                        className={cn(
                          'flex items-center px-4 py-2 text-sm',
                          active ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-3" />
                        Configuración
                      </a>
                    )}
                  </Menu.Item>
                  <div className="border-t border-neutral-200 my-1" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={cn(
                          'flex items-center w-full px-4 py-2 text-sm text-left',
                          active ? 'bg-muted text-danger-600' : 'text-danger-600'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Botón menú móvil */}
            <button
              type="button"
              className="md:hidden p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div className="md:hidden border-t border-neutral-200 py-4">
            {/* Navegación móvil */}
            <nav className="space-y-1 mb-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-4 py-2 text-base font-medium rounded-lg transition-colors',
                    item.current
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Usuario móvil */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center px-4 py-2">
                <UserCircleIcon className="h-10 w-10 text-neutral-400" />
                <div className="ml-3">
                  <p className="text-base font-medium text-neutral-900">
                    {displayName}
                  </p>
                  <p className="text-sm text-neutral-500 capitalize">
                    {userRole === 'therapist' ? 'Terapeuta' : 'Paciente'}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-muted rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-muted rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Configuración
                </a>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-danger-600 hover:bg-danger-50 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default AppHeader; 