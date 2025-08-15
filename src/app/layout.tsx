import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import ConditionalLayout from './conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'José - Técnico de Sistemas',
  description: 'Portfólio profissional de José, Técnico de Sistemas especializado em manutenção, configuração e otimização de sistemas computacionais.',
  keywords: ['técnico de sistemas', 'tecnologia', 'hardware', 'software', 'redes', 'manutenção'],
  authors: [{ name: 'José' }],
  creator: 'José',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://joseportfolio.com',
    title: 'José - Técnico de Sistemas',
    description: 'Portfólio profissional de José, Técnico de Sistemas',
    siteName: 'José Portfolio',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
