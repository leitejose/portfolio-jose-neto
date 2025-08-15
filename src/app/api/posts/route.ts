import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return Response.json(posts)
    } catch (dbError) {
      console.error('Erro ao buscar posts:', dbError)
      
      // Return mock data when database is unavailable
      const mockPosts = [
        {
          id: 1,
          title: "Desenvolvimento com React e TypeScript",
          content: "Explorando as melhores práticas para desenvolvimento frontend moderno com React e TypeScript...",
          excerpt: "Explorando as melhores práticas para desenvolvimento frontend moderno...",
          published: true,
          views: 156,
          imageUrl: "/api/placeholder/600/300",
          createdAt: new Date('2025-08-05'),
          updatedAt: new Date('2025-08-05'),
          authorId: 1,
          author: {
            name: "José Leite",
            email: "joseleite688@gmail.com"
          },
          categories: [
            {
              category: { id: 1, name: "React", slug: "react" }
            },
            {
              category: { id: 2, name: "TypeScript", slug: "typescript" }
            }
          ],
          tags: [
            {
              tag: { id: 1, name: "Frontend", slug: "frontend" }
            }
          ]
        },
        {
          id: 2,
          title: "Business Intelligence com Power BI",
          content: "Como criar dashboards eficientes para análise de dados empresariais usando Power BI...",
          excerpt: "Como criar dashboards eficientes para análise de dados empresariais...",
          published: true,
          views: 203,
          imageUrl: "/api/placeholder/600/300",
          createdAt: new Date('2025-08-03'),
          updatedAt: new Date('2025-08-03'),
          authorId: 1,
          author: {
            name: "José Leite",
            email: "joseleite688@gmail.com"
          },
          categories: [
            {
              category: { id: 3, name: "Power BI", slug: "power-bi" }
            },
            {
              category: { id: 4, name: "Analytics", slug: "analytics" }
            }
          ],
          tags: [
            {
              tag: { id: 2, name: "Business Intelligence", slug: "bi" }
            }
          ]
        }
      ]

      return Response.json(mockPosts)
    }
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, excerpt, published, coverImage, categoryIds, tagNames } = body

    // Criar slug a partir do título
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Buscar usuário admin (temporário)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      return Response.json({ error: 'Usuário admin não encontrado' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published: published || false,
        publishedAt: published ? new Date() : null,
        coverImage,
        authorId: adminUser.id,
      }
    })

    // Conectar categorias se fornecidas
    if (categoryIds && categoryIds.length > 0) {
      await prisma.postCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          postId: post.id,
          categoryId
        }))
      })
    }

    return Response.json(post, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
