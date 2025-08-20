import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import ConditionalLayout from './conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'José Leite - Programador Web & Mestrando em SIG',
    template: '%s | José Leite - Programador Web'
  },
  description: 'José Leite - Programador Web especializado em React, TypeScript, NestJS e GraphQL. Mestrando em Sistemas de Informação de Gestão com foco em análise de dados e otimização de processos.',
  keywords: [
    'José Leite',
    'programador web',
    'desenvolvedor frontend',
    'desenvolvedor backend',
    'React',
    'TypeScript',
    'NestJS',
    'GraphQL',
    'Next.js',
    'análise de dados',
    'Power BI',
    'sistemas de informação',
    'portfolio programador',
    'desenvolvedor portugal',
    'web developer',
    'fullstack developer'
  ],
  authors: [{ name: 'José Leite', url: 'https://joseneto.tech' }],
  creator: 'José Leite',
  publisher: 'José Leite',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://joseneto.tech',
    title: 'José Leite - Programador Web & Mestrando em SIG',
    description: 'Programador Web especializado em React, TypeScript, NestJS e GraphQL. Mestrando em Sistemas de Informação de Gestão.',
    siteName: 'José Leite Portfolio',
    images: [
      {
        url: 'https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253564/portfolio/portfolio/fotojose.jpg',
        width: 1200,
        height: 630,
        alt: 'José Leite - Programador Web',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'José Leite - Programador Web & Mestrando em SIG',
    description: 'Programador Web especializado em React, TypeScript, NestJS e GraphQL.',
    images: ['https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253564/portfolio/portfolio/fotojose.jpg'],
  },
  verification: {
    google: 'google-site-verification-code', // Você vai precisar adicionar isso no Google Search Console
  },
  alternates: {
    canonical: 'https://joseneto.tech',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
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
