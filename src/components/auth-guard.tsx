'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Shield, Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Páginas que não precisam de autenticação
      const publicAdminPages = ['/admin/login']
      
      if (publicAdminPages.includes(pathname)) {
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      // Verificar se o usuário está autenticado
      const authStatus = localStorage.getItem('isAuthenticated')
      const userEmail = localStorage.getItem('userEmail')
      
      if (authStatus === 'true' && userEmail) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        // Redirecionar para login se não estiver autenticado
        router.push('/admin/login')
      }
      
      setIsLoading(false)
    }

    // Pequeno delay para evitar flash
    const timer = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timer)
  }, [pathname, router])

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Verificando acesso...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Por favor, aguarde
          </p>
        </div>
      </div>
    )
  }

  // Tela de não autorizado
  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-6">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você precisa fazer login para acessar esta área.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  // Renderizar o conteúdo se autenticado
  return <>{children}</>
}
