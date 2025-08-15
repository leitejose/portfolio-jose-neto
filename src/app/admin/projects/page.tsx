'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react'

interface Technology {
  id: string
  name: string
  slug: string
  color?: string
  icon?: string
}

interface ProjectTechnology {
  technology: Technology
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  imageUrl?: string
  publicId?: string
  demoUrl?: string
  repoUrl?: string
  featured: boolean
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
  technologies: ProjectTechnology[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Erro ao carregar projetos')
      
      const data = await response.json()
      console.log('Dados recebidos da API:', data)
      
      // A API retorna { projects: [], pagination: {} }
      if (data && Array.isArray(data.projects)) {
        setProjects(data.projects)
      } else {
        console.warn('Formato de dados inesperado:', data)
        setProjects([])
      }
    } catch (err) {
      setError('Erro ao carregar projetos')
      console.error('Erro ao carregar projetos:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erro ao excluir projeto')
      
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      setError('Erro ao excluir projeto')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciar Projetos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Adicione, edite ou remova projetos do seu portfólio
          </p>
        </div>
        
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Projeto
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg">
          {error}
        </div>
      )}

      {Array.isArray(projects) && projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comece criando seu primeiro projeto
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Criar Primeiro Projeto
          </Link>
        </div>
      ) : Array.isArray(projects) && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Imagem do Projeto */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded">
                      Destaque
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>

                {/* Tecnologias */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((projectTech) => (
                      <span
                        key={projectTech.technology.id}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded"
                      >
                        {projectTech.technology.name}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex space-x-2 mb-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      <EyeIcon className="w-3 h-3 mr-1" />
                      Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                    >
                      GitHub
                    </a>
                  )}
                </div>

                {/* Ações */}
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded transition-colors"
                  >
                    <PencilIcon className="w-3 h-3 mr-1" />
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 text-sm font-medium rounded transition-colors"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Erro nos dados dos projetos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ocorreu um erro ao carregar os projetos. Verifique o console para mais detalhes.
          </p>
        </div>
      )}
    </div>
  )
}
