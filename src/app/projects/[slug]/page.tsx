'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react'

interface Project {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  imageUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
  featured: boolean
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
  technologies?: Array<{
    technology: {
      name: string
      slug: string
    }
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        // Buscar todos os projetos e filtrar pelo slug
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error('Erro ao carregar projetos')
        }
        
        const data = await response.json()
        const foundProject = data.projects?.find((p: Project) => p.slug === params.slug)
        
        if (!foundProject) {
          throw new Error('Projeto não encontrado')
        }
        
        setProject(foundProject)
      } catch (err) {
        console.error('Erro ao buscar projeto:', err)
        setError('Projeto não encontrado')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.slug) {
      fetchProject()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando projeto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              {error || 'Projeto não encontrado'}
            </h1>
            <Link
              href="/#projects"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos projetos
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
          <Link
            href="/#projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos projetos
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </h1>
            {project.featured && (
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                Destaque
              </span>
            )}
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {project.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Ver Demo
              </Link>
            )}
            {project.repoUrl && (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <Github className="w-5 h-5 mr-2" />
                Ver Código
              </Link>
            )}
          </div>
        </div>

        {/* Project Image */}
        {project.imageUrl && (
          <div className="relative h-96 mb-8 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Tag className="w-6 h-6 mr-2" />
              Tecnologias Utilizadas
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium"
                >
                  {tech.technology.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Content */}
        {project.content && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sobre o Projeto
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {project.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Informações do Projeto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Criado em</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Atualizado em</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Gostou deste projeto? Vamos conversar!
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Entrar em Contato
          </Link>
        </div>
      </div>
    </div>
  )
}
