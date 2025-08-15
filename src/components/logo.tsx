'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  alt?: string
}

export default function Logo({ 
  width = 50, 
  height = 50, 
  className = "rounded-lg",
  alt = "José - Técnico de Sistemas"
}: LogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Aguarda a hidratação para evitar mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // URLs das logos
  const logoWhite = "https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253565/portfolio/portfolio/logo.png"
  const logoBlack = "https://res.cloudinary.com/dvqzo7snh/image/upload/v1755254425/portfolio/portfolio/logo-black.png"

  if (!mounted) {
    // Retorna logo branca por padrão durante o loading
    return (
      <Image
        src={logoWhite}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority
      />
    )
  }

  // Determina o tema atual
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  // Escolhe a logo baseada no tema
  const logoSrc = isDark ? logoWhite : logoBlack

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} transition-all duration-300`}
      priority
      onError={(e) => {
        console.error('Erro ao carregar logo:', logoSrc)
        // Fallback para logo branca se der erro
        e.currentTarget.src = logoWhite
      }}
    />
  )
}
