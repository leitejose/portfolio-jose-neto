'use client'

import { GraduationCap, Code, Database, BarChart } from 'lucide-react'
import { useState } from 'react'

export function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const skills = [
    {
      icon: Code,
      title: 'Desenvolvimento Web',
      description: 'React, TypeScript, NestJS, GraphQL e desenvolvimento de aplicações modernas.'
    },
    {
      icon: Database,
      title: 'Bases de Dados',
      description: 'MySQL, Prisma ORM, modelagem e otimização de bases de dados relacionais.'
    },
    {
      icon: BarChart,
      title: 'Business Intelligence',
      description: 'Power BI, análise exploratória de dados, dashboards e apoio à decisão.'
    },
    {
      icon: GraduationCap,
      title: 'Sistemas de Informação',
      description: 'Gestão de projetos, análise de sistemas e soluções tecnológicas estratégicas.'
    }
  ]

  const expertises = [
    { name: 'React.js', size: 'text-4xl', color: 'text-blue-500', priority: 1 },
    { name: 'TypeScript', size: 'text-3xl', color: 'text-blue-600', priority: 1 },
    { name: 'NestJS', size: 'text-2xl', color: 'text-red-500', priority: 2 },
    { name: 'GraphQL', size: 'text-3xl', color: 'text-pink-500', priority: 1 },
    { name: 'MySQL', size: 'text-xl', color: 'text-orange-500', priority: 2 },
    { name: 'Prisma ORM', size: 'text-2xl', color: 'text-indigo-500', priority: 2 },
    { name: 'Power BI', size: 'text-3xl', color: 'text-yellow-500', priority: 1 },
    { name: 'Business Intelligence', size: 'text-xl', color: 'text-green-500', priority: 2 },
    { name: 'GitHub', size: 'text-lg', color: 'text-gray-600', priority: 3 },
    { name: 'JavaScript', size: 'text-2xl', color: 'text-yellow-400', priority: 2 },
    { name: 'HTML5', size: 'text-lg', color: 'text-orange-400', priority: 3 },
    { name: 'CSS3', size: 'text-lg', color: 'text-blue-400', priority: 3 },
    { name: 'SQL', size: 'text-xl', color: 'text-purple-500', priority: 2 },
    { name: 'Excel', size: 'text-base', color: 'text-green-600', priority: 3 },
    { name: 'Power Query', size: 'text-base', color: 'text-teal-500', priority: 3 },
    { name: 'Análise de Dados', size: 'text-xl', color: 'text-cyan-500', priority: 2 },
    { name: 'ETL', size: 'text-base', color: 'text-emerald-500', priority: 3 },
    { name: 'Dashboards', size: 'text-lg', color: 'text-violet-500', priority: 3 }
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sobre Mim
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Programador Web e Mestrando em Sistemas de Informação de Gestão
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Description */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Formação e Experiência
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                Sou estudante de Mestrado em Sistemas de Informação de Gestão (fase final), com formação prévia em Ciências Contábeis e experiência prática no desenvolvimento web e análise de dados.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                Atualmente, atuo como Programador Web (estágio curricular), participando do desenvolvimento de aplicações com React, TypeScript, NestJS e GraphQL, além de trabalhar com bases de dados MySQL e Prisma ORM.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Possuo competências em Power BI, SQL, Excel e ferramentas de versionamento como GitHub, sempre buscando aplicar soluções tecnológicas inovadoras aos desafios empresariais.
              </p>
            </div>
          </div>

          {/* Right side - Technology Cloud */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="rounded-3xl p-8 overflow-hidden relative group">
                <div className="relative flex flex-wrap items-center justify-center gap-6 leading-relaxed min-h-[450px] py-8">
                  {expertises.map((expertise, index) => {
                    const isHovered = hoveredIndex === index
                    const isNearHovered = hoveredIndex !== null && Math.abs(hoveredIndex - index) <= 2
                    
                    return (
                      <span
                        key={index}
                        className={`${expertise.size} ${expertise.color} dark:opacity-95 font-bold 
                          transition-all duration-500 cursor-default select-none
                          hover:shadow-2xl px-4 py-2 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-700/80
                          relative backdrop-blur-sm
                          ${expertise.priority === 1 ? 'drop-shadow-lg' : expertise.priority === 2 ? 'drop-shadow-md' : 'drop-shadow-sm'}
                          hover:drop-shadow-2xl border border-transparent hover:border-current/20
                          ${isHovered ? 'scale-125 z-30 rotate-0' : ''}
                          ${isNearHovered && !isHovered ? 'scale-105 -translate-y-2' : ''}
                          ${hoveredIndex !== null && !isNearHovered && !isHovered ? 'scale-90 opacity-60' : ''}`}
                        style={{
                          transform: `
                            ${isHovered ? 'rotate(0deg) translateY(-10px) scale(1.25)' : 
                              isNearHovered ? `rotate(${(index * 3) % 20 - 10}deg) translateY(-8px) scale(1.05)` :
                              hoveredIndex !== null ? `rotate(${(index * 2) % 8 - 4}deg) translateY(${(index * 2) % 4}px) scale(0.9)` :
                              `rotate(${(index * 4) % 12 - 6}deg) translateY(${(index * 5) % 20 - 10}px)`}
                          `,
                          animationDelay: `${index * 0.05}s`,
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {expertise.name}
                        
                        {/* Ripple effect on hover */}
                        {isHovered && (
                          <div className="absolute inset-0 rounded-2xl bg-current/10 animate-ping pointer-events-none" />
                        )}
                      </span>
                    )
                  })}
                </div>
                
                {/* Enhanced floating particles that react to hover */}
                <div className={`absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${hoveredIndex !== null ? 'animate-bounce scale-150 opacity-80' : 'animate-ping opacity-60'}`}></div>
                <div className={`absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full transition-all duration-300 ${hoveredIndex !== null ? 'animate-ping scale-200 opacity-70' : 'animate-pulse opacity-40'}`}></div>
                <div className={`absolute top-1/3 left-4 w-1.5 h-1.5 bg-green-400 rounded-full transition-all duration-300 ${hoveredIndex !== null ? 'animate-pulse scale-150 opacity-80' : 'animate-bounce opacity-50'}`}></div>
                
                {/* Dynamic background glow that follows hover */}
                {hoveredIndex !== null && (
                  <div 
                    className="absolute inset-0 bg-gradient-radial from-current/5 via-transparent to-transparent pointer-events-none animate-pulse"
                    style={{
                      background: `radial-gradient(circle at ${50 + (hoveredIndex % 3 - 1) * 20}% ${50 + Math.floor(hoveredIndex / 3) * 15}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Minha Jornada
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {/* 2024 - Programador Web */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Out 2024 - Jul 2025</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Programador Web</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">MARNOCO, LDA - Estágio Curricular Concluído</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">React • TypeScript • NestJS • GraphQL</div>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
                
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* 2022 - Mestrado */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8"></div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
                
                <div className="w-1/2 pl-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">Set 2023 - Atual</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Mestrado em SIG</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Coimbra Business School (Fase Final)</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Business Intelligence • Análise de Dados</div>
                  </div>
                </div>
              </div>

              {/* 2021 - Formatura */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Jun 2015 - Ago 2021</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Ciências Contábeis</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Universidade Federal do Semi-árido</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Bacharelado Concluído</div>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
                
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* 2015 - Técnico */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8"></div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
                
                <div className="w-1/2 pl-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">Jul 2014 - Jul 2015</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Técnico em Logística</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Universidade Potiguar</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Primeira Formação Técnica</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
