'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Upload } from 'lucide-react'

interface CloudinaryUploadWidgetProps {
  onUploadAction: (imageUrl: string, publicId: string) => void
  preset?: string
  folder?: string
  buttonText?: string
  className?: string
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function CloudinaryUploadWidget({
  onUploadAction,
  preset = 'ml_default',
  folder = 'photography',
  buttonText = 'Selecionar do Cloudinary',
  className = ''
}: CloudinaryUploadWidgetProps) {
  const cloudinaryRef = useRef<any>()
  const widgetRef = useRef<any>()

  const initializeWidget = useCallback(() => {
    if (!cloudinaryRef.current) return

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvqzo7snh',
        uploadPreset: preset,
        folder: folder,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 4/3,
        croppingShowDimensions: true,
        showAdvancedOptions: true,
        croppingValidateDimensions: true,
        croppingDefaultSelectionRatio: 1,
        theme: 'minimal',
        styles: {
          palette: {
            window: '#ffffff',
            sourceBg: '#f4f4f5',
            windowBorder: '#90a0b3',
            tabIcon: '#0078ff',
            inactiveTabIcon: '#69778a',
            menuIcons: '#5a616a',
            link: '#0078ff',
            action: '#339933',
            inProgress: '#0078ff',
            complete: '#339933',
            error: '#cc0000',
            textDark: '#000000',
            textLight: '#fcfffd'
          }
        },
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 10000000, // 10MB
        maxImageWidth: 4000,
        maxImageHeight: 4000,
        resourceType: 'image'
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url
          const publicId = result.info.public_id
          onUploadAction(imageUrl, publicId)
        }
        
        if (error) {
          console.error('Erro no upload:', error)
        }
      }
    )
  }, [onUploadAction, preset, folder])

  useEffect(() => {
    // Carregar o script do Cloudinary se não estiver carregado
    if (!window.cloudinary) {
      const script = document.createElement('script')
      script.src = 'https://upload-widget.cloudinary.com/global/all.js'
      script.async = true
      script.onload = () => {
        cloudinaryRef.current = window.cloudinary
        initializeWidget()
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    } else {
      cloudinaryRef.current = window.cloudinary
      initializeWidget()
    }
  }, [initializeWidget])

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open()
    }
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      <Upload className="w-4 h-4 mr-2" />
      {buttonText}
    </button>
  )
}
