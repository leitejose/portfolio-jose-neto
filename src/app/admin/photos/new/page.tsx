'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CloudinaryUploadWidget from '@/components/cloudinary-upload-widget'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus,
  MapPin,
  Calendar,
  Camera
} from 'lucide-react'

interface PhotoForm {
  title: string
  description: string
  location: string
  imageUrl: string
  category: string
  tags: string[]
  equipment: {
    camera: string
    lens: string
    settings: string
  }
  capturedAt: string
  featured: boolean
}

export default function NewPhotoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
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
    featured: false
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

  const handleCloudinaryUploadAction = (imageUrl: string, publicId: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageUrl
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
      // Implementar integração com Supabase e Cloudinary
      console.log('Salvando foto:', formData)
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para a lista de fotos
      router.push('/admin/photos')
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
      alert('Erro ao salvar a foto. Tente novamente.')
    } finally {
      setLoading(false)
    }
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
                type="submit"
                form="new-photo-form"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Foto'}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nova Fotografia
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Adicione uma nova foto à sua galeria de viagens
            </p>
          </div>
        </div>

        <form id="new-photo-form" onSubmit={handleSubmit} className="space-y-8">
          {/* URL da Imagem */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL da Imagem *
            </label>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <CloudinaryUploadWidget
                  onUploadAction={handleCloudinaryUploadAction}
                  folder="photography"
                  buttonText="Upload via Cloudinary"
                  className="shrink-0"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cole o link da sua foto ou use o botão acima para fazer upload direto no Cloudinary
              </p>
            </div>
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
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Adicione tags relacionadas ao local, tipo de foto, cores, etc.
            </p>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fotos em destaque aparecem em posição de maior visibilidade na galeria
          </p>
        </form>
      </div>
    </div>
  )
}
