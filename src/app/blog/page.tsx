'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

interface Post {
  id: string
  title: string
  excerpt?: string
  content: string
  publishedAt: string
  readTime?: string
  category?: string
  tags: string[]
  featured: boolean
  slug: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Erro ao carregar posts')
        }
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
        setError('Erro ao carregar posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog 
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Compartilhando conhecimento e experiências na área de tecnologia e sistemas
          </p>
        </div>

        {/* Conteúdo do Blog */}
        {posts.length === 0 ? (
          // Estado vazio - Em breve
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Em Breve
              </h2>
              
            </div>
            
          </div>
        ) : (
          // Conteúdo quando há posts
          <>
            {/* Featured Posts */}
            {posts.filter(post => post.featured).length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Posts em Destaque</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {posts.filter(post => post.featured).map((post) => (
                    <article
                      key={post.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-6xl opacity-20">📝</div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                            Destaque
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {post.readTime && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          )}
                          {post.category && (
                            <div className="flex items-center space-x-1">
                              <Tag className="w-4 h-4" />
                              <span>{post.category}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        {post.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
                        >
                          Ler mais
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Todos os Posts</h2>
              <div className="grid gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                  >
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      )}
                      {post.category && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{post.category}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
                      >
                        Ler mais
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
