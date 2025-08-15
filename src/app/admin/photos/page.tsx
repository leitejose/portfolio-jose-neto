'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  MapPin,
  Calendar,
  Loader2,
  Download
} from 'lucide-react'

interface Photo {
  id: string
  title: string
  description: string | null
  location: string | null
  imageUrl: string
  thumbnailUrl: string | null
  featured: boolean
  published: boolean
  views: number
  createdAt: string
  updatedAt: string
  photographer: {
    name: string | null
    email: string
  }
}

interface PhotosData {
  photos: Photo[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function PhotosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [photosData, setPhotosData] = useState<PhotosData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          admin: 'true', // Flag para mostrar todas as fotos no admin
          ...(searchTerm && { search: searchTerm })
        })
        
        const response = await fetch(`/api/photos?${params}`)
        if (!response.ok) {
          throw new Error('Erro ao carregar fotografias')
        }
        
        const data = await response.json()
        setPhotosData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Photos fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [searchTerm, currentPage])

  const refetchPhotos = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '12',
      admin: 'true', // Flag para mostrar todas as fotos no admin
      ...(searchTerm && { search: searchTerm })
    })
    
    const response = await fetch(`/api/photos?${params}`)
    if (!response.ok) {
      throw new Error('Erro ao carregar fotografias')
    }
    
    const data = await response.json()
    setPhotosData(data)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) {
      return
    }

    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir foto')
      }

      // Refresh the photos list
      refetchPhotos()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir foto')
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  if (loading && !photosData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">
            Carregando fotografias...
          </span>
        </div>
      </div>
    )
  }

  if (error && !photosData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={refetchPhotos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gerenciar Fotografias
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Organize sua galeria de fotografias de viagem
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Link
              href="/admin/photos/sync"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              Sincronizar Cloudinary
            </Link>
            <Link
              href="/admin/photos/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Foto
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar fotografias..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading state for search/pagination */}
        {loading && photosData && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}

        {/* Photos Grid */}
        {photosData && photosData.photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photosData.photos.map((photo) => (
                <div key={photo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          href={`/admin/photos/${photo.id}/edit`}
                          className="p-1.5 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link
                          href={photo.imageUrl}
                          target="_blank"
                          className="p-1.5 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="p-1.5 bg-white bg-opacity-90 text-red-600 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {photo.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          Destaque
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {photo.title}
                    </h3>
                    
                    {photo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    
                    {photo.location && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(photo.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {photo.published ? 'Publicado' : 'Rascunho'}
                      </span>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{photo.views}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Por: {photo.photographer.name || photo.photographer.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {photosData.pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando página {photosData.pagination.currentPage} de {photosData.pagination.totalPages}
                  ({photosData.pagination.totalCount} fotos no total)
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!photosData.pagination.hasPrev}
                    className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anterior
                  </button>
                  
                  <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">
                    {photosData.pagination.currentPage}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!photosData.pagination.hasNext}
                    className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Nenhuma fotografia encontrada com os termos de busca.'
                : 'Nenhuma fotografia encontrada. Faça upload da sua primeira foto!'
              }
            </div>
            {!searchTerm && (
              <Link
                href="/admin/photos/new"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeira foto
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
