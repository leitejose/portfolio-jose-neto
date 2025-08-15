'use client'

import { useState, useEffect } from 'react'
import { Mail, User, Calendar, MessageSquare, Eye, EyeOff, Trash2, Archive } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contacts')
      const data = await response.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'READ' })
      })

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status: 'READ' as const } : contact
        ))
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'unread') return contact.status === 'UNREAD'
    if (filter === 'read') return contact.status === 'READ'
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-blue-100 text-blue-800'
      case 'READ': return 'bg-gray-100 text-gray-800'
      case 'REPLIED': return 'bg-green-100 text-green-800'
      case 'ARCHIVED': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mensagens Recebidas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as mensagens enviadas através do formulário de contato
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Todas ({contacts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Não lidas ({contacts.filter(c => c.status === 'UNREAD').length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'read'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Lidas ({contacts.filter(c => c.status === 'READ').length})
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma mensagem encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? 'Ainda não há mensagens recebidas.'
                : `Não há mensagens ${filter === 'unread' ? 'não lidas' : 'lidas'}.`
              }
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer ${
                contact.status === 'UNREAD' ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
              }`}
              onClick={() => {
                setSelectedMessage(contact)
                if (contact.status === 'UNREAD') {
                  markAsRead(contact.id)
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status === 'UNREAD' ? 'Não lida' : 
                       contact.status === 'READ' ? 'Lida' :
                       contact.status === 'REPLIED' ? 'Respondida' : 'Arquivada'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {contact.email}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {contact.subject}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {contact.message}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedMessage.subject}
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{selectedMessage.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Mensagem:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Responder por Email
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
