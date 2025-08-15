'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUploadAction: (url: string, publicId: string) => void
  currentImage?: string
  folder?: string
  className?: string
  placeholder?: string
}

export default function ImageUpload({
  onImageUploadAction,
  currentImage,
  folder = 'projects',
  className = '',
  placeholder = 'Clique para fazer upload de uma imagem'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 10MB')
      return
    }

    // Mostrar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload para Cloudinary
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const data = await response.json()
      onImageUploadAction(data.url, data.publicId)
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
      setPreviewUrl(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageUploadAction('', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                title="Alterar imagem"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                title="Remover imagem"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Fazendo upload...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg 
                     hover:border-blue-500 dark:hover:border-blue-400 transition-colors
                     flex items-center justify-center bg-gray-50 dark:bg-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Fazendo upload...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{placeholder}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG, WEBP até 10MB
                </p>
              </>
            )}
          </div>
        </button>
      )}
    </div>
  )
}
