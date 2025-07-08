import { useTheme } from '../theme-provider'
import { 
  SunIcon, 
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { cn } from '../../lib/cn'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    {
      name: 'Claro',
      value: 'light',
      icon: SunIcon,
      description: 'Modo claro'
    },
    {
      name: 'Oscuro',
      value: 'dark',
      icon: MoonIcon,
      description: 'Modo oscuro'
    },
    {
      name: 'Sistema',
      value: 'system',
      icon: ComputerDesktopIcon,
      description: 'Usar configuración del sistema'
    }
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]
  const Icon = currentTheme.icon

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <Icon className="h-4 w-4" />
        <span className="sr-only">Cambiar tema</span>
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
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-popover border border-border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {themes.map((themeOption) => {
              const ThemeIcon = themeOption.icon
              return (
                <Menu.Item key={themeOption.value}>
                  {({ active }) => (
                    <button
                      onClick={() => setTheme(themeOption.value)}
                      className={cn(
                        'flex items-center w-full px-3 py-2 text-sm transition-colors',
                        active 
                          ? 'bg-accent text-accent-foreground' 
                          : 'text-popover-foreground',
                        theme === themeOption.value && 'bg-accent/50'
                      )}
                    >
                      <ThemeIcon className="h-4 w-4 mr-3" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{themeOption.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {themeOption.description}
                        </span>
                      </div>
                      {theme === themeOption.value && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  )}
                </Menu.Item>
              )
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ThemeToggle