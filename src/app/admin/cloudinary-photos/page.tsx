'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, MapPin, Edit3, Eye, Grid, List, Filter, Upload, Loader2 } from 'lucide-react'

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

export default function CloudinaryPhotosPage() {
  const [photos, setPhotos] = useState<CloudinaryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [editingPhoto, setEditingPhoto] = useState<CloudinaryPhoto | null>(null)

  // Estados do modal de edição
  const [editForm, setEditForm] = useState({
    title: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cloudinary-photos')
      if (!response.ok) throw new Error('Erro ao carregar fotos')
      
      const data = await response.json()
      setPhotos(data.photos)
    } catch (error) {
      console.error('Erro ao carregar fotos:', error)
      alert('Erro ao carregar fotos do Cloudinary')
    } finally {
      setLoading(false)
    }
  }

  const updatePhoto = async () => {
    if (!editingPhoto) return

    try {
      const response = await fetch('/api/cloudinary-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: editingPhoto.id,
          ...editForm
        })
      })

      if (!response.ok) throw new Error('Erro ao atualizar foto')

      // Atualizar foto na lista local
      setPhotos(prev => prev.map(photo => 
        photo.id === editingPhoto.id 
          ? { ...photo, ...editForm }
          : photo
      ))

      setEditingPhoto(null)
      alert('Foto atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      alert('Erro ao atualizar foto')
    }
  }

  const openEditModal = (photo: CloudinaryPhoto) => {
    setEditingPhoto(photo)
    setEditForm({
      title: photo.title,
      location: photo.location,
      description: photo.description
    })
  }

  // Filtrar fotos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || photo.location === selectedLocation
    return matchesSearch && matchesLocation
  })

  // Obter localizações únicas
  const locations = Array.from(new Set(photos.map(photo => photo.location).filter(Boolean)))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Sincronizando fotos do Cloudinary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Galeria de Fotos - Cloudinary</h1>
        <p className="text-gray-600">Gerencie suas fotos sincronizadas do Cloudinary</p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={loadPhotos}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Sincronizar Fotos
          </button>
          <span className="text-sm text-gray-500 self-center">
            {photos.length} fotos encontradas
          </span>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar fotos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por localização */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Todas as localizações</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modo de visualização */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid de Fotos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src={photo.thumbnail}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => window.open(photo.url, '_blank')}
                      className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(photo)}
                      className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{photo.title}</h3>
                {photo.location && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {photo.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Lista de Fotos */
        <div className="space-y-4">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={photo.thumbnail}
                  alt={photo.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{photo.title}</h3>
                {photo.location && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {photo.location}
                  </div>
                )}
                {photo.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{photo.description}</p>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  {photo.width} × {photo.height} • {new Date(photo.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(photo.url, '_blank')}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(photo)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edição */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Editar Foto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Título da foto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Localização</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Lisboa, Portugal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descrição da foto"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={updatePhoto}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {filteredPhotos.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Upload className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma foto encontrada</h3>
          <p className="text-gray-500 mb-6">
            {photos.length === 0 
              ? 'Faça upload de fotos para a pasta "photography" no Cloudinary'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          <button
            onClick={loadPhotos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sincronizar Fotos
          </button>
        </div>
      )}
    </div>
  )
}
