import { Settings } from 'lucide-react'
import Link from 'next/link'
import Logo from './logo'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo width={32} height={32} alt="José Neto - Programador Web" />
              <div>
                <h3 className="text-xl font-bold">José Neto</h3>
                <p className="text-sm text-gray-400">Programador Web & Mestrando em SIG</p>
              </div>
            </div>
           
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Sobre
              </a>
              <a href="#projects" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Projetos
              </a>
              <Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Blog
              </Link>
              <a href="/photography" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Fotografia
              </a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Contato
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>joseleite688@gmail.com</p>
              <p>+351 960001464</p>
              <p>Coimbra, Portugal</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 José - Técnico de Sistemas. Todos os direitos reservados.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Settings className="h-3 w-3 mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
