'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface SyncStats {
  synced: number
  skipped: number
  total: number
}

export default function SyncPhotosPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    stats?: SyncStats
  } | null>(null)

  const handleSync = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/photos/sync', {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Erro ao sincronizar:', error)
      setResult({
        success: false,
        message: 'Erro ao sincronizar fotos. Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin/photos"
              className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sincronizar Fotos do Cloudinary
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Importe todas as suas fotos do Cloudinary para o banco de dados
              </p>
            </div>
          </div>
        </div>

        {/* Sync Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
              <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Sincronizar Fotos
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Esta ação irá buscar todas as fotos do seu Cloudinary e adicioná-las ao banco de dados.
              Fotos que já existem serão ignoradas para evitar duplicatas.
            </p>

            {/* Botão de Sincronização */}
            <button
              onClick={handleSync}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Iniciar Sincronização
                </>
              )}
            </button>
          </div>

          {/* Resultado */}
          {result && (
            <div className={`mt-8 p-4 rounded-lg border ${
              result.success
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    result.success
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {result.success ? 'Sincronização Concluída!' : 'Erro na Sincronização'}
                  </p>
                  
                  <p className={`mt-1 text-sm ${
                    result.success
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {result.message}
                  </p>

                  {/* Estatísticas */}
                  {result.success && result.stats && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {result.stats.synced}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Novas Fotos
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {result.stats.skipped}
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                          Já Existiam
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {result.stats.total}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          Total Encontradas
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Como funciona a sincronização?
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Busca todas as imagens do seu Cloudinary</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Extrai informações como título, descrição e localização dos metadados</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Adiciona apenas fotos que ainda não existem no banco de dados</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Todas as fotos são marcadas como publicadas por padrão</p>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <Link
              href="/admin/photos"
              className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Fotos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
