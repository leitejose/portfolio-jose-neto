# 🚀 Portfólio José - Técnico de Sistemas

Um portfólio moderno e responsivo desenvolvido com Next.js 14, TypeScript e Tailwind CSS para um técnico de sistemas especializado em soluções tecnológicas inovadoras.

## ✨ Características

### 🎨 Design Moderno
- Interface clean e profissional
- Modo escuro/claro automático
- Animações suaves e interativas
- Totalmente responsivo

### 📱 Funcionalidades
- **Hero Section**: Apresentação profissional com call-to-actions
- **Sobre**: Habilidades, experiência e estatísticas
- **Projetos**: Showcase de projetos técnicos
- **Blog**: Artigos técnicos e dicas de tecnologia
- **Fotografia**: Galeria de fotos de viagens com lightbox
- **Contato**: Formulário de contato e informações

### 🛠️ Tecnologias

#### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **Next Themes** - Gerenciamento de temas

#### Futuras Implementações
- **NestJS** - Backend com GraphQL
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Apollo Client** - Cliente GraphQL
- **NextAuth.js** - Autenticação

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd jose-portfolio
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Linting do código
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router pages
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   ├── blog/              # Páginas do blog
│   └── photography/       # Galeria de fotos
├── components/            # Componentes React
│   ├── hero.tsx          # Seção hero
│   ├── about.tsx         # Seção sobre
│   ├── projects.tsx      # Seção projetos
│   ├── contact.tsx       # Seção contato
│   ├── navigation.tsx    # Navegação
│   ├── footer.tsx        # Rodapé
│   └── theme-provider.tsx # Provider de tema
└── lib/                  # Utilitários e configurações
```

## 🎯 Funcionalidades Detalhadas

### 🏠 Página Inicial
- Hero section com apresentação profissional
- Seção sobre com habilidades e experiência
- Portfolio de projetos técnicos
- Formulário de contato funcional

### 📝 Blog Técnico
- Lista de artigos técnicos
- Categorização por temas
- Posts em destaque
- Sistema de tags
- Newsletter subscription

### 📸 Galeria de Fotografia
- Grid responsivo de fotos
- Lightbox para visualização ampliada
- Filtros por categoria
- Informações EXIF
- Estatísticas de viagem

### 📧 Sistema de Contato
- Formulário de contato validado
- Informações de contato
- Links para redes sociais
- Status de disponibilidade

## 🎨 Design System

### Cores
- **Primary**: Azul (#3B82F6) para elementos principais
- **Secondary**: Roxo (#8B5CF6) para gradientes
- **Dark**: Cinza escuro (#1F2937) para modo escuro
- **Light**: Branco (#FFFFFF) para modo claro

### Tipografia
- **Font**: Inter (Google Fonts)
- **Escala**: Tailwind's typography scale

### Componentes
- Botões com gradientes e hover effects
- Cards com sombras e animações
- Formulários com validação visual
- Navegação responsiva com menu hamburger

## 🚀 Roadmap

### Fase 1 ✅ (Atual)
- [x] Setup inicial do Next.js
- [x] Design system com Tailwind
- [x] Componentes principais
- [x] Páginas estáticas
- [x] Responsividade
- [x] Dark mode

### Fase 2 🚧 (Em Desenvolvimento)
- [ ] Backend com NestJS
- [ ] API GraphQL
- [ ] Banco de dados com Prisma
- [ ] Sistema de autenticação
- [ ] CMS para blog posts

### Fase 3 📋 (Planejado)
- [ ] Upload de imagens
- [ ] Comentários no blog
- [ ] Analytics e métricas
- [ ] SEO otimizado
- [ ] PWA capabilities

## 📊 Performance

- **Core Web Vitals**: Otimizado
- **Lighthouse Score**: 95+
- **Bundle Size**: Otimizado com code splitting
- **Images**: Next.js Image optimization

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### Tailwind Config
Configurações personalizadas em `tailwind.config.js`:
- Cores customizadas
- Animations personalizadas
- Breakpoints responsivos

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

**José** - Técnico de Sistemas
- Email: jose.sistemas@email.com
- LinkedIn: [linkedin.com/in/jose](https://linkedin.com/in/jose)
- GitHub: [github.com/jose](https://github.com/jose)

---

⭐ **Se gostou do projeto, deixe uma estrela no repositório!**
