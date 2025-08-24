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
    default: 'José Neto',
    template: '%s | José Neto'
  },
  description: 'José Neto - Programador Web especializado em React, TypeScript, NestJS e GraphQL. Mestrando em Sistemas de Informação de Gestão com foco em análise de dados e otimização de processos.',
  keywords: [
    'José Neto',
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
  authors: [{ name: 'José Neto', url: 'https://joseneto.tech' }],
  creator: 'José Neto',
  publisher: 'José Neto',
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
    title: 'José Neto - Programador Web & Mestrando em SIG',
    description: 'Programador Web especializado em React, TypeScript, NestJS e GraphQL. Mestrando em Sistemas de Informação de Gestão.',
    siteName: 'José Neto Portfolio',
    images: [
      {
        url: 'https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253564/portfolio/portfolio/fotojose.jpg',
        width: 1200,
        height: 630,
        alt: 'José Neto - Programador Web',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'José Neto - Programador Web & Mestrando em SIG',
    description: 'Programador Web especializado em React, TypeScript, NestJS e GraphQL.',
    images: ['https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253564/portfolio/portfolio/fotojose.jpg'],
  },
  verification: {
    google: 'google-site-verification-code', // Você vai precisar adicionar isso no Google Search Console
  },
  alternates: {
    canonical: 'https://joseneto.tech',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon-32x32.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
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
