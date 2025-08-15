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

  if (!mounted) {
    // Retorna logo branca por padrão durante o loading
    return (
      <Image
        src="https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253565/portfolio/portfolio/logo.png"
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  }

  // Determina o tema atual
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  // Escolhe a logo baseada no tema
  const logoSrc = isDark 
    ? "https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253565/portfolio/portfolio/logo.png" // Logo branca para tema escuro
    : "https://res.cloudinary.com/dvqzo7snh/image/upload/v1755254075/portfolio/portfolio/logo-black.png" // Logo preta para tema claro

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} transition-all duration-300`}
    />
  )
}
