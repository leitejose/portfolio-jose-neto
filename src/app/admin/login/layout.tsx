import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Login - José Portfolio',
  description: 'Página de login administrativa',
}

interface LoginLayoutProps {
  children: ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
}
