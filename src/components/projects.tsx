'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { convertGoogleDriveUrl } from '@/lib/image-utils'

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
  technologies?: Array<{
    technology: {
      name: string
      slug: string
    }
  }>
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error('Erro ao carregar projetos')
        }
        const data = await response.json()
        setProjects(data.projects || [])
      } catch (err) {
        console.error('Erro ao buscar projetos:', err)
        setError('Erro ao carregar projetos')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando projetos...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredProjects = projects.filter(project => project.featured && project.published)
  const otherProjects = projects.filter(project => !project.featured && project.published)

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meus Projetos
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Projetos de desenvolvimento web, análise de dados e sistemas de informação
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Projetos em Destaque</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <Link href={`/projects/${project.slug}`}>
                    <div className="relative h-64 cursor-pointer">
                      {project.imageUrl ? (
                        <Image
                          src={convertGoogleDriveUrl(project.imageUrl)}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-full flex items-center justify-center">
                          <div className="text-white text-6xl opacity-20">
                            🌐
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                          Destaque
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link href={`/projects/${project.slug}`}>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {project.title}
                      </h4>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                          >
                            {tech.technology.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex gap-3">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver Demo
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm transition-colors"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            Código
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Outros Projetos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <Link href={`/projects/${project.slug}`}>
                    <div className="relative h-48 cursor-pointer">
                      {project.imageUrl ? (
                        <Image
                          src={convertGoogleDriveUrl(project.imageUrl)}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-gray-400 to-gray-600 h-full flex items-center justify-center">
                          <div className="text-white text-4xl opacity-30">
                            💻
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link href={`/projects/${project.slug}`}>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {project.title}
                      </h4>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {tech.technology.name}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 text-xs">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          Demo
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-gray-600 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          Código
                          <Github className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nenhum projeto encontrado.
            </p>
          </div>
        )}

        {/* CTA */}
        {projects.length > 0 && (
          <div className="text-center mt-16">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Interessado em trabalhar comigo?
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Vamos Conversar
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
