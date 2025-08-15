'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PlusCircle, 
  FileText, 
  Camera, 
  Settings, 
  BarChart3,
  Users,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Eye,
  Loader2
} from 'lucide-react'

interface DashboardStats {
  posts: number
  publishedPosts: number
  photos: number
  views: number
  messages: number
  unreadMessages: number
}

interface RecentPost {
  id: string
  title: string
  excerpt: string | null
  status: 'published' | 'draft'
  views: number
  author: string
  categories: string[]
  createdAt: string
}

interface RecentPhoto {
  id: string
  title: string
  location: string
  views: number
  imageUrl: string | null
  createdAt: string
}

interface DashboardData {
  stats: DashboardStats
  recentPosts: RecentPost[]
  recentPhotos: RecentPhoto[]
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard')
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">
            Carregando dashboard...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie seu conteúdo e monitore estatísticas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Posts</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dashboardData.stats.posts}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {dashboardData.stats.publishedPosts} publicados
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Fotos</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dashboardData.stats.photos}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Visualizações</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dashboardData.stats.views.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Mensagens</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {dashboardData.stats.messages}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {dashboardData.stats.unreadMessages} não lidas
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Post
                  </Link>            <Link
              href="/admin/photos/new"
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
            >
              <Camera className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                Nova Foto
              </span>
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200"
            >
              <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                Ver Mensagens
              </span>
            </Link>

            <Link
              href="/admin/posts"
              className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
            >
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Gerenciar Posts
              </span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Configurações
              </span>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Posts Recentes
              </h2>
              <Link
                href="/admin/posts"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.recentPosts.length > 0 ? (
                dashboardData.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            post.status === 'published'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}
                        >
                          {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </span>
                        <span>{post.author}</span>
                        {post.categories.length > 0 && (
                          <span className="text-blue-600 dark:text-blue-400">
                            {post.categories[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum post encontrado
                  </p>
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeiro post
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Photos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Fotos Recentes
              </h2>
              <Link
                href="/admin/photos"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.recentPhotos.length > 0 ? (
                dashboardData.recentPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {photo.imageUrl ? (
                          <Image
                            src={photo.imageUrl}
                            alt={photo.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {photo.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{photo.location}</span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{photo.views}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/photos/${photo.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma foto encontrada
                  </p>
                  <Link
                    href="/admin/photos/new"
                    className="inline-flex items-center mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar primeira foto
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
