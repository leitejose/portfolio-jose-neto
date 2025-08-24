'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Globe, 
  Mail, 
  Shield, 
  Palette,
  Database,
  Camera,
  FileText,
  Bell,
  Eye,
  Download,
  Upload
} from 'lucide-react'

interface SiteSettings {
  // Informações Pessoais
  name: string
  title: string
  email: string
  bio: string
  location: string
  
  // Configurações do Site
  siteTitle: string
  siteDescription: string
  siteUrl: string
  
  // Redes Sociais
  github: string
  linkedin: string
  twitter: string
  instagram: string
  
  // Configurações do Blog
  postsPerPage: number
  showExcerpts: boolean
  allowComments: boolean
  
  // Configurações da Galeria
  photosPerPage: number
  showExifData: boolean
  enableLightbox: boolean
  
  // Notificações
  emailNotifications: boolean
  newCommentNotifications: boolean
  
  // Backup
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  
  const [settings, setSettings] = useState<SiteSettings>({
    // Informações Pessoais
    name: 'José',
    title: 'Técnico de Sistemas',
    email: 'jose@exemplo.com',
    bio: 'Especialista em sistemas, redes e automação. Apaixonado por tecnologia e fotografia de viagem.',
    location: 'Portugal',
    
    // Configurações do Site
    siteTitle: 'José - Portfolio',
    siteDescription: 'Portfolio profissional de um técnico de sistemas especializado em infraestrutura e automação.',
    siteUrl: 'https://jose-portfolio.com',
    
    // Redes Sociais
    github: 'https://github.com/leitejose',
    linkedin: 'https://www.linkedin.com/in/jos%C3%A9-leite-69318183/',
    twitter: '',
    instagram: 'https://instagram.com/jose_photos',
    
    // Configurações do Blog
    postsPerPage: 10,
    showExcerpts: true,
    allowComments: false,
    
    // Configurações da Galeria
    photosPerPage: 12,
    showExifData: true,
    enableLightbox: true,
    
    // Notificações
    emailNotifications: true,
    newCommentNotifications: false,
    
    // Backup
    autoBackup: true,
    backupFrequency: 'weekly'
  })

  const handleInputChange = (field: keyof SiteSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Implementar salvamento das configurações no Supabase
      console.log('Salvando configurações:', settings)
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar as configurações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    // Implementar exportação de dados
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'portfolio-settings.json'
    link.click()
  }

  const tabs = [
    { id: 'personal', label: 'Pessoal', icon: User },
    { id: 'site', label: 'Site', icon: Globe },
    { id: 'social', label: 'Redes Sociais', icon: Mail },
    { id: 'content', label: 'Conteúdo', icon: FileText },
    { id: 'gallery', label: 'Galeria', icon: Camera },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar ao Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
              <button
                type="submit"
                form="settings-form"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configurações
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gerencie as configurações do seu portfolio
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Pessoais */}
              {activeTab === 'personal' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Informações Pessoais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título Profissional
                      </label>
                      <input
                        type="text"
                        value={settings.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Localização
                      </label>
                      <input
                        type="text"
                        value={settings.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Biografia
                    </label>
                    <textarea
                      value={settings.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                </div>
              )}

              {/* Configurações do Site */}
              {activeTab === 'site' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Configurações do Site
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título do Site
                      </label>
                      <input
                        type="text"
                        value={settings.siteTitle}
                        onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição do Site
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL do Site
                      </label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Redes Sociais */}
              {activeTab === 'social' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Redes Sociais
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={settings.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/usuario"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={settings.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/usuario"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/usuario"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Configurações de Conteúdo */}
              {activeTab === 'content' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Configurações de Conteúdo
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Posts por Página
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.postsPerPage}
                        onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showExcerpts"
                        checked={settings.showExcerpts}
                        onChange={(e) => handleInputChange('showExcerpts', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showExcerpts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Mostrar resumos dos posts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowComments"
                        checked={settings.allowComments}
                        onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowComments" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Permitir comentários
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Configurações da Galeria */}
              {activeTab === 'gallery' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Configurações da Galeria
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fotos por Página
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.photosPerPage}
                        onChange={(e) => handleInputChange('photosPerPage', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showExifData"
                        checked={settings.showExifData}
                        onChange={(e) => handleInputChange('showExifData', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showExifData" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Mostrar dados EXIF das fotos
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableLightbox"
                        checked={settings.enableLightbox}
                        onChange={(e) => handleInputChange('enableLightbox', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableLightbox" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Ativar lightbox para visualização
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notificações */}
              {activeTab === 'notifications' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Notificações
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Receber notificações por email
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newCommentNotifications"
                        checked={settings.newCommentNotifications}
                        onChange={(e) => handleInputChange('newCommentNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="newCommentNotifications" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Notificar sobre novos comentários
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup */}
              {activeTab === 'backup' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Backup e Export
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoBackup"
                        checked={settings.autoBackup}
                        onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoBackup" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Backup automático
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequência do Backup
                      </label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleInputChange('backupFrequency', e.target.value as 'daily' | 'weekly' | 'monthly')}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
