'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { remark } from 'remark'
import html from 'remark-html'
import { convertGoogleDriveUrl } from '@/lib/image-utils'
import CloudinaryUploadWidget from '@/components/cloudinary-upload-widget'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus,
  Trash2,
  Edit3,
  FileText
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
  fontStyle: 'academic' | 'modern' | 'mono' | 'elegant'
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [previewHtml, setPreviewHtml] = useState('')
  const [postExists, setPostExists] = useState(true)
  
  const [formData, setFormData] = useState<PostForm>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    featuredImage: '',
    publishDate: '',
    fontStyle: 'academic'
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

  const fontOptions = [
    { value: 'academic', label: 'Acadêmica (Times New Roman)', class: 'font-academic' },
    { value: 'modern', label: 'Moderna (Sans-serif)', class: 'font-modern' },
    { value: 'mono', label: 'Monoespaçada (Courier)', class: 'font-mono' },
    { value: 'elegant', label: 'Elegante (Georgia)', class: 'font-elegant' }
  ]

  const getFontClass = (fontStyle: string) => {
    const font = fontOptions.find(f => f.value === fontStyle)
    return font?.class || 'font-academic'
  }

  // Função para processar Markdown
  const processMarkdown = async (content: string) => {
    try {
      const processedContent = await remark()
        .use(html)
        .process(content)
      return processedContent.toString()
    } catch (error) {
      console.error('Erro ao processar Markdown:', error)
      return content
    }
  }

  // Atualizar preview quando o conteúdo mudar
  useEffect(() => {
    if (formData.content) {
      processMarkdown(formData.content).then(setPreviewHtml)
    } else {
      setPreviewHtml('')
    }
  }, [formData.content])

  useEffect(() => {
    // Carregar dados do post do Supabase
    const loadPost = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/posts/${postId}`)
        
        if (response.ok) {
          const post = await response.json()
          setFormData({
            title: post.title || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            category: post.category || '',
            tags: post.tags || [],
            status: post.published ? 'published' : 'draft',
            featuredImage: post.coverImage || '',
            publishDate: post.publishedAt || '',
            fontStyle: post.fontStyle || 'academic'
          })
        } else if (response.status === 404) {
          setNotFound(true)
        } else {
          console.error('Erro ao carregar post')
          setNotFound(true)
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      loadPost()
    }
  }, [postId])

  const handleInputChange = (field: keyof PostForm, value: string) => {
    // Converter automaticamente links do Google Drive para formato direto
    if (field === 'featuredImage' && value.includes('drive.google.com')) {
      value = convertGoogleDriveUrl(value)
    }
    
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
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        published: formData.status === 'published',
        featured: false,
        coverImage: formData.featuredImage || null
      }

      console.log('📤 Editando post - Enviando dados:', postData)
      console.log('🖼️ featuredImage:', formData.featuredImage)
      console.log('🖼️ coverImage:', postData.coverImage)

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Falha ao atualizar o post')
      }

      const result = await response.json()
      console.log('✅ Post atualizado:', result)
      
      // Redirecionar para a lista de posts
      router.push('/admin/posts')
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      alert('Erro ao atualizar o post. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
      return
    }
    
    setLoading(true)
    try {
      // Implementar exclusão com Supabase
      console.log('Excluindo post:', postId)
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/admin/posts')
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      alert('Erro ao excluir o post. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">Carregando post...</div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post não encontrado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              O post que você está tentando editar não existe.
            </p>
            <Link
              href="/admin/posts"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Posts
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
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </button>
              <button
                type="submit"
                form="edit-post-form"
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
              Editar Post
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Edite as informações do seu artigo
            </p>
          </div>
        </div>

        <form id="edit-post-form" onSubmit={handleSubmit} className="space-y-8">
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
              Imagem Destacada
            </label>
            <div className="space-y-3">
              {/* Upload do Cloudinary */}
              <CloudinaryUploadWidget
                onUploadAction={(imageUrl, publicId) => {
                  setFormData(prev => ({
                    ...prev,
                    featuredImage: imageUrl
                  }))
                }}
                preset="ml_default"
                folder="blog-covers"
                buttonText="Fazer Upload da Imagem"
                className="w-full"
              />
              
              {/* Campo de URL manual */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">ou</div>
              <input
                type="url"
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                placeholder="Cole a URL da imagem aqui..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
