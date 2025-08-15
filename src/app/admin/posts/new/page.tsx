'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus
} from 'lucide-react'

interface PostForm {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  featuredImage: string
  publishDate: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  const [formData, setFormData] = useState<PostForm>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    featuredImage: '',
    publishDate: ''
  })

  const categories = [
    'Sistemas',
    'Redes',
    'Segurança',
    'Automação',
    'Virtualização',
    'Cloud',
    'Hardware',
    'Backup',
    'Troubleshooting',
    'Tutoriais'
  ]

  const handleInputChange = (field: keyof PostForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      // Implementar integração com Supabase
      console.log('Salvando post:', formData)
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para a lista de posts
      router.push('/admin/posts')
    } catch (error) {
      console.error('Erro ao salvar post:', error)
      alert('Erro ao salvar o post. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setFormData(prev => ({ ...prev, status: 'draft' }))
    await handleSubmit(new Event('submit') as any)
  }

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, status: 'published' }))
    await handleSubmit(new Event('submit') as any)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/posts"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar aos Posts
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Novo Post
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Crie um novo artigo para o seu blog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Post *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Digite o título do seu post..."
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Resumo */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resumo
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Breve descrição do post..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conteúdo *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Escreva o conteúdo do seu post aqui... (Markdown suportado)"
              required
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Você pode usar Markdown para formatar o texto. Exemplo: **negrito**, *itálico*, `código`
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as PostForm['status'])}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="scheduled">Agendado</option>
              </select>
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
                  {tag}
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

          {/* Imagem Destacada */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL da Imagem Destacada
            </label>
            <input
              type="url"
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => handleInputChange('featuredImage', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.featuredImage && (
              <div className="mt-3">
                <Image
                  src={formData.featuredImage}
                  alt="Preview"
                  width={400}
                  height={128}
                  className="h-32 w-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Data de Publicação (se agendado) */}
          {formData.status === 'scheduled' && (
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Publicação *
              </label>
              <input
                type="datetime-local"
                id="publishDate"
                value={formData.publishDate}
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
