import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import { remark } from 'remark'
import html from 'remark-html'
import ViewCounter from './view-counter'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

// Helper para determinar a classe da fonte
const getFontClass = (fontStyle: string) => {
  const fontMap: Record<string, string> = {
    'academic': 'font-academic',
    'modern': 'font-modern',
    'mono': 'font-mono',
    'elegant': 'font-elegant'
  }
  return fontMap[fontStyle] || 'font-academic'
}

async function processMarkdown(content: string) {
  const processedContent = await remark()
    .use(html)
    .process(content)
  return processedContent.toString()
}

async function getPostBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('Erro ao buscar post:', error)
      return null
    }

    // Processar o conteúdo Markdown para HTML
    const contentHtml = await processMarkdown(data.content)

    return {
      ...data,
      contentHtml
    }
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return null
  }
}

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Botão voltar */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Blog
        </Link>

        {/* Imagem de capa */}
        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Cabeçalho do post */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime} min de leitura
              </div>
            )}

            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              José Neto
            </div>

            {post.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                ⭐ Post em Destaque
              </span>
            )}
          </div>
        </header>

        {/* Conteúdo do post */}
        <article className={`academic-content max-w-none ${getFontClass(post.fontStyle || 'academic')}`}>
          <div 
            className="academic-text text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {/* Footer do post */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ViewCounter postId={post.id} initialViews={post.views || 0} />
            
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Ver mais posts
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  return {
    title: `${post.title} - José Neto`,
    description: post.excerpt || 'Blog de José Neto',
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Blog de José Neto',
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}
