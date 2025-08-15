'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Linkedin, Github } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert('Mensagem enviada com sucesso! Retornarei em breve.')
        // Limpar o formulário
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        alert(data.error || 'Erro ao enviar mensagem. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Estou sempre aberto a novos desafios e oportunidades. Vamos conversar!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Vamos trabalhar juntos?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                Se você tem um projeto em mente, precisa de suporte técnico ou quer discutir 
                uma oportunidade de trabalho, ficarei feliz em conversar com você.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h4>
                  <a 
                    href="mailto:joseleite688@gmail.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    joseleite688@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Telefone</h4>
                  <a 
                    href="tel:+351960001464"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    +351 960 001 464
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Localização</h4>
                  <p className="text-gray-600 dark:text-gray-400">Coimbra, Portugal</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Redes Sociais
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-900 rounded-xl flex items-center justify-center transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Disponível para novos projetos
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Atualmente aceitando novos projetos e oportunidades de trabalho.
                Tempo de resposta: 24-48 horas.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                  placeholder="Qual o motivo do contato?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white resize-none"
                  placeholder="Descreva seu projeto ou dúvida..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
