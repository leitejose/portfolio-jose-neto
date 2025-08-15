'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import AuthGuard from '../../components/auth-guard'
import { 
  LogOut, 
  User, 
  Settings,
  Home,
  FileText,
  Camera,
  Mail,
  Menu,
  X,
  FolderOpen,
  Code
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Se for a página de login, renderizar apenas o conteúdo sem layout admin
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')
      router.push('/admin/login')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Projetos', href: '/admin/projects', icon: FolderOpen },
    { name: 'Tecnologias', href: '/admin/technologies', icon: Code },
    { name: 'Fotografias', href: '/admin/photos', icon: Camera },
    { name: 'Mensagens', href: '/admin/messages', icon: Mail },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent navigation={navigation} onLogout={handleLogout} />
            </div>
          </div>
        )}

        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-20">
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <SidebarContent navigation={navigation} onLogout={handleLogout} />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 lg:z-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex-1 flex">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Painel Administrativo
                </h1>
              </div>
              <div className="ml-4 flex items-center lg:ml-6">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 text-sm font-medium"
                >
                  Ver Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

function SidebarContent({ navigation, onLogout }: { navigation: any[], onLogout: () => void }) {
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null

  return (
    <>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userEmail || 'Administrador'}
              </p>
            </div>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={onLogout}
          className="flex-shrink-0 w-full group block"
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 bg-red-100 dark:bg-red-900 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors duration-200">
              <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Sair do Sistema
              </p>
            </div>
          </div>
        </button>
      </div>
    </>
  )
}
