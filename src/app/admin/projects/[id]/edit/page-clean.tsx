'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  imageUrl: string
  projectUrl?: string
  githubUrl?: string
  technologies: string[]
  featured: boolean
  category: string
  publicId?: string
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchProject(resolvedParams.id)
    }
  }, [resolvedParams])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const projectData = await response.json()
        setProject(projectData)
      } else {
        setMessage('Erro ao carregar projeto')
      }
    } catch (error) {
      setMessage('Erro ao carregar projeto')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name: string, value: any, type: string = 'text') => {
    setProject(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? value : value
    } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !resolvedParams?.id) return

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      })

      if (response.ok) {
        setMessage('Projeto atualizado com sucesso!')
        setTimeout(() => {
          router.push('/admin/projects')
        }, 1500)
      } else {
        setMessage('Erro ao atualizar projeto')
      }
    } catch (error) {
      setMessage('Erro ao atualizar projeto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!resolvedParams?.id) return
    
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        const response = await fetch(`/api/projects/${resolvedParams.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setMessage('Projeto excluído com sucesso!')
          setTimeout(() => {
            router.push('/admin/projects')
          }, 1500)
        } else {
          setMessage('Erro ao excluir projeto')
        }
      } catch (error) {
        setMessage('Erro ao excluir projeto')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Projeto não encontrado</p>
          <button
            onClick={() => router.push('/admin/projects')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Voltar para Projetos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Editar Projeto</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Curta
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Longa
              </label>
              <textarea
                value={project.longDescription || ''}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={project.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Projeto
              </label>
              <input
                type="url"
                value={project.projectUrl || ''}
                onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do GitHub
              </label>
              <input
                type="url"
                value={project.githubUrl || ''}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tecnologias (separadas por vírgula)
              </label>
              <input
                type="text"
                value={project.technologies.join(', ')}
                onChange={(e) => handleInputChange('technologies', e.target.value.split(', ').filter(t => t.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="React, Node.js, TypeScript"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={project.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="api">API</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={project.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked, 'checkbox')}
                  className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Projeto em Destaque</span>
              </label>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${message.includes('sucesso') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir Projeto
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/projects')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
