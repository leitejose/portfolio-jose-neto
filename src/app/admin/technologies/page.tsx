'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Technology {
  id: string
  name: string
  slug: string
  color?: string
  icon?: string
}

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTech, setEditingTech] = useState<Technology | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: ''
  })

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('/api/technologies')
      if (response.ok) {
        const data = await response.json()
        setTechnologies(data.technologies || [])
      }
    } catch (error) {
      console.error('Erro ao carregar tecnologias:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnologies()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingTech ? `/api/technologies/${editingTech.id}` : '/api/technologies'
      const method = editingTech ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTechnologies()
        setShowForm(false)
        setEditingTech(null)
        setFormData({ name: '', color: '#3B82F6', icon: '' })
      }
    } catch (error) {
      console.error('Erro ao salvar tecnologia:', error)
    }
  }

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech)
    setFormData({
      name: tech.name,
      color: tech.color || '#3B82F6',
      icon: tech.icon || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tecnologia?')) {
      try {
        const response = await fetch(`/api/technologies/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchTechnologies()
        }
      } catch (error) {
        console.error('Erro ao excluir tecnologia:', error)
      }
    }
  }

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tecnologias</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Tecnologia
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingTech ? 'Editar Tecnologia' : 'Nova Tecnologia'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cor</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 h-10 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ícone (emoji ou texto)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="⚛️, JS, etc."
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingTech ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTech(null)
                    setFormData({ name: '', color: '#3B82F6', icon: '' })
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technologies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech) => (
          <div key={tech.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {tech.icon && <span className="text-lg">{tech.icon}</span>}
                <h3 className="font-medium">{tech.name}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(tech)}
                  className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(tech.id)}
                  className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {tech.color && (
              <div
                className="w-full h-2 rounded"
                style={{ backgroundColor: tech.color }}
              />
            )}
          </div>
        ))}
      </div>

      {technologies.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma tecnologia cadastrada ainda.
        </div>
      )}
    </div>
  )
}
