'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus,
  MapPin,
  Calendar,
  Camera,
  Trash2
} from 'lucide-react'

interface PhotoForm {
  id?: string
  title: string
  description: string
  location: string
  imageUrl: string
  thumbnail?: string
  category: string
  tags: string[]
  equipment: {
    camera: string
    lens: string
    settings: string
  }
  capturedAt: string
  featured: boolean
  published: boolean
  width?: number
  height?: number
}

export default function EditPhotoPage() {
  const router = useRouter()
  const params = useParams()
  const photoId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [photoExists, setPhotoExists] = useState(true)
  
  const [formData, setFormData] = useState<PhotoForm>({
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    category: '',
    tags: [],
    equipment: {
      camera: '',
      lens: '',
      settings: ''
    },
    capturedAt: '',
    featured: false,
    published: false
  })

  const categories = [
    'Paisagem',
    'Natureza',
    'Arquitetura',
    'Urbano',
    'Retrato',
    'Macro',
    'Street',
    'Noturna',
    'Vida Selvagem',
    'Cultural'
  ]

  useEffect(() => {
    // Carregar dados reais da foto
    const loadPhoto = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/photos/${photoId}`)
        if (response.ok) {
          const photo = await response.json()
          setFormData({
            id: photo.id,
            title: photo.title || '',
            description: photo.description || '',
            location: photo.location || '',
            imageUrl: photo.imageUrl || '',
            thumbnail: photo.thumbnail || '',
            category: photo.category || '',
            tags: photo.tags || [],
            equipment: photo.equipment || {
              camera: '',
              lens: '',
              settings: ''
            },
            capturedAt: photo.capturedAt ? new Date(photo.capturedAt).toISOString().split('T')[0] : '',
            featured: photo.featured || false,
            published: photo.published || false,
            width: photo.width,
            height: photo.height
          })
        } else {
          setPhotoExists(false)
        }
      } catch (error) {
        console.error('Erro ao carregar foto:', error)
        setPhotoExists(false)
      } finally {
        setLoading(false)
      }
    }

    loadPhoto()
  }, [photoId])

  const handleInputChange = (field: keyof PhotoForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEquipmentChange = (field: keyof PhotoForm['equipment'], value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [field]: value
      }
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          imageUrl: formData.imageUrl,
          category: formData.category,
          tags: formData.tags,
          equipment: formData.equipment,
          capturedAt: formData.capturedAt ? new Date(formData.capturedAt).toISOString() : null,
          featured: formData.featured,
          published: formData.published
        }),
      })

      if (response.ok) {
        router.push('/admin/photos')
      } else {
        const error = await response.json()
        alert(`Erro ao atualizar a foto: ${error.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      alert('Erro ao atualizar a foto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.')) {
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/photos')
      } else {
        const error = await response.json()
        alert(`Erro ao excluir a foto: ${error.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao excluir foto:', error)
      alert('Erro ao excluir a foto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">Carregando foto...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!photoExists) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Foto não encontrada
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              A foto que você está tentando editar não existe.
            </p>
            <Link
              href="/admin/photos"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Fotos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/photos"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar às Fotos
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </button>
              <button
                type="submit"
                form="edit-photo-form"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Editar Fotografia
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Edite as informações da sua foto
            </p>
          </div>
        </div>

        <form id="edit-photo-form" onSubmit={handleSubmit} className="space-y-8">
          {/* URL da Imagem */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL da Imagem *
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://exemplo.com/sua-foto.jpg"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.imageUrl && (
              <div className="mt-4">
                <div className="relative aspect-[4/3] max-w-md">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título da Foto *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Digite o título da sua foto..."
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Conte a história por trás desta foto..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Localização */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Localização *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ex: Santorini, Grécia"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecionar categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data da Captura */}
          <div>
            <label htmlFor="capturedAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data da Captura
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="capturedAt"
                value={formData.capturedAt}
                onChange={(e) => handleInputChange('capturedAt', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma tag..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Equipamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Equipamento Fotográfico
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="camera" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Câmera
                </label>
                <input
                  type="text"
                  id="camera"
                  value={formData.equipment.camera}
                  onChange={(e) => handleEquipmentChange('camera', e.target.value)}
                  placeholder="Ex: Canon EOS R5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="lens" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lente
                </label>
                <input
                  type="text"
                  id="lens"
                  value={formData.equipment.lens}
                  onChange={(e) => handleEquipmentChange('lens', e.target.value)}
                  placeholder="Ex: 24-70mm f/2.8"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="settings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Configurações
              </label>
              <input
                type="text"
                id="settings"
                value={formData.equipment.settings}
                onChange={(e) => handleEquipmentChange('settings', e.target.value)}
                placeholder="Ex: f/8, 1/250s, ISO 100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Foto em Destaque */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Marcar como foto em destaque
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}
