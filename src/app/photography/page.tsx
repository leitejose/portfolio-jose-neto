'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Calendar, X, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'

interface CloudinaryPhoto {
  id: string
  url: string
  thumbnail: string
  title: string
  location: string
  description: string
  tags: string[]
  createdAt: string
  width: number
  height: number
}

// Função para otimizar URLs do Cloudinary
const optimizeCloudinaryUrl = (url: string, width: number = 640, quality: number = 75) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }
  
  try {
    const parts = url.split('/upload/')
    if (parts.length !== 2) return url
    
    const [baseUrl, imagePath] = parts
    const transformations = `w_${width},q_${quality},f_auto`
    
    return `${baseUrl}/upload/${transformations}/${imagePath}`
  } catch (error) {
    console.error('Erro ao otimizar URL do Cloudinary:', error)
    return url
  }
}

// Componente de imagem com fallback
const PhotoImage = ({ src, alt, width, height, className, sizes, onClick }: {
  src: string
  alt: string
  width: number
  height: number
  className: string
  sizes: string
  onClick?: () => void
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleError = () => {
    console.error('Erro ao carregar imagem:', src)
    setImageError(true)
    setImageLoading(false)
  }

  const handleLoad = () => {
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer`}
        onClick={onClick}
      >
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          <div className="text-sm mb-2">Imagem não disponível</div>
          <div className="text-xs">{alt}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
        >
          <div className="text-gray-500 dark:text-gray-400 text-sm">Carregando...</div>
        </div>
      )}
      <img
        src={optimizeCloudinaryUrl(src, 640, 75)}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        onClick={onClick}
        loading="lazy"
      />
    </div>
  )
}

// Função para formatação consistente de datas
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      timeZone: 'UTC'
    })
  } catch {
    return 'Data inválida'
  }
}

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<CloudinaryPhoto[]>([])
  const [allLocations, setAllLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<CloudinaryPhoto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [mounted, setMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const loadAllLocations = useCallback(async () => {
    try {
      // Carregar todas as fotos sem paginação para extrair localizações
      const response = await fetch('/api/photos?limit=1000&locations_only=true')
      if (!response.ok) throw new Error('Erro ao carregar localizações')
      
      const data = await response.json()
      const allPhotos = data.photos || []
      
      const uniqueLocations = Array.from(
        new Set(allPhotos.map((photo: any) => photo.location).filter(Boolean))
      ).sort() as string[]
      
      setAllLocations(uniqueLocations)
    } catch (error) {
      console.error('Erro ao carregar localizações:', error)
    }
  }, [])

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm })
      })
      
      const response = await fetch(`/api/photos?${params}`)
      if (!response.ok) throw new Error('Erro ao carregar fotos')
      
      const data = await response.json()
      
      const convertedPhotos: CloudinaryPhoto[] = data.photos ? data.photos.map((photo: any) => ({
        id: photo.id,
        url: photo.imageUrl,
        thumbnail: photo.thumbnailUrl || photo.imageUrl,
        title: photo.title,
        location: photo.location || '',
        description: photo.description || '',
        tags: [],
        createdAt: photo.takenAt || photo.createdAt,
        width: photo.width || 800,
        height: photo.height || 600
      })) : []
      
      setPhotos(convertedPhotos)
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalCount(data.pagination?.totalCount || 0)
    } catch (error) {
      console.error('Erro ao carregar fotos:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    setMounted(true)
    loadPhotos()
    loadAllLocations()
  }, [loadPhotos, loadAllLocations])

  const handlePhotoClick = useCallback((photo: CloudinaryPhoto) => {
    setSelectedPhoto(photo)
  }, [])

  const filteredPhotos = photos.filter(photo => {
    const matchesLocation = !selectedLocation || photo.location === selectedLocation
    return matchesLocation
  })

  const nextPhoto = useCallback(() => {
    if (!selectedPhoto) return
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    const nextIndex = (currentIndex + 1) % filteredPhotos.length
    setSelectedPhoto(filteredPhotos[nextIndex])
  }, [selectedPhoto, filteredPhotos])

  const prevPhoto = useCallback(() => {
    if (!selectedPhoto) return
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    const prevIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1
    setSelectedPhoto(filteredPhotos[prevIndex])
  }, [selectedPhoto, filteredPhotos])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedPhoto) return
      switch (e.key) {
        case 'Escape':
          setSelectedPhoto(null)
          break
        case 'ArrowRight':
          nextPhoto()
          break
        case 'ArrowLeft':
          prevPhoto()
          break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedPhoto, filteredPhotos, nextPhoto, prevPhoto])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando galeria...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Galeria de Fotografia
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Uma coleção de momentos capturados ao redor do mundo.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col lg:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar fotos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white min-w-[200px]"
              >
                <option value="">Todos os lugares</option>
                {allLocations.map((location: string) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'foto' : 'fotos'}
          </div>
        </div>

        {/* Layout Mosaico */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(photo)}
              className="mb-2 break-inside-avoid cursor-pointer group"
            >
              <PhotoImage
                src={photo.thumbnail}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover group-hover:opacity-90 transition duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                onClick={() => setSelectedPhoto(photo)}
              />
            </div>
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Anterior
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Próxima
              </button>
            </div>
            <div className="ml-6 text-sm text-gray-600 dark:text-gray-400">
              {totalCount} fotos no total
            </div>
          </div>
        )}

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            
            {/* Container principal */}
            <div className="w-full h-full flex flex-col items-center justify-center max-w-6xl">
              {/* Imagem */}
              <div className="flex-1 flex items-center justify-center w-full pb-4 mt-8">
                <PhotoImage
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  className="max-w-full max-h-[80vh] object-contain"
                  sizes="100vw"
                />
              </div>
              
              {/* Informações */}
              <div className="w-full bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {selectedPhoto.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(selectedPhoto.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{selectedPhoto.width} × {selectedPhoto.height}</span>
                  </div>
                </div>
                {selectedPhoto.description && (
                  <p className="text-gray-300 text-sm mt-2">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
