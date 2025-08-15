'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Não mostrar navegação e footer nas páginas admin
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // Durante a hidratação, renderiza sem verificações específicas de cliente
  if (!mounted) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }
  
  if (isAdminRoute) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }
  
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
