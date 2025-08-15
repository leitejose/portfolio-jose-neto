import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Try to connect to database, if fails return mock data
    try {
      // Get post statistics
      const totalPosts = await prisma.post.count()
      const publishedPosts = await prisma.post.count({
        where: { published: true }
      })

      // Get photo statistics
      const totalPhotos = await prisma.photo.count()

      // Get contact/messages statistics
      const totalMessages = await prisma.contact.count()
      const unreadMessages = await prisma.contact.count({
        where: { status: 'UNREAD' }
      })

      // Get recent posts with basic info
      const recentPosts = await prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          excerpt: true,
          published: true,
          views: true,
          createdAt: true,
          author: {
            select: {
              name: true
            }
          },
          categories: {
            select: {
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })

      // Get recent photos with basic info
      const recentPhotos = await prisma.photo.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          location: true,
          views: true,
          imageUrl: true,
          createdAt: true
        }
      })

      // Calculate total views (sum of post views + photo views)
      const postViewsSum = await prisma.post.aggregate({
        _sum: {
          views: true
        }
      })

      const photoViewsSum = await prisma.photo.aggregate({
        _sum: {
          views: true
        }
      })

      const totalViews = (postViewsSum._sum.views || 0) + (photoViewsSum._sum.views || 0)

      const dashboardData = {
        stats: {
          posts: totalPosts,
          publishedPosts,
          photos: totalPhotos,
          views: totalViews,
          messages: totalMessages,
          unreadMessages
        },
        recentPosts: recentPosts.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          status: post.published ? 'published' : 'draft',
          views: post.views || 0,
          author: post.author?.name || 'Autor Desconhecido',
          categories: post.categories.map(postCat => postCat.category.name),
          createdAt: post.createdAt
        })),
        recentPhotos: recentPhotos.map(photo => ({
          id: photo.id,
          title: photo.title,
          location: photo.location || 'Localização não informada',
          views: photo.views || 0,
          imageUrl: photo.imageUrl,
          createdAt: photo.createdAt
        }))
      }

      return NextResponse.json(dashboardData)

    } catch (dbError) {
      console.warn('Database connection failed, using mock data:', dbError)
      
      // Return mock data when database is unavailable
      const mockDashboardData = {
        stats: {
          posts: 8,
          publishedPosts: 5,
          photos: 12,
          views: 1247,
          messages: 3,
          unreadMessages: 1
        },
        recentPosts: [
          {
            id: 1,
            title: "Desenvolvimento com React e TypeScript",
            excerpt: "Explorando as melhores práticas para desenvolvimento frontend moderno...",
            status: "published",
            views: 156,
            author: "José Leite",
            categories: ["React", "TypeScript"],
            createdAt: new Date('2025-08-05')
          },
          {
            id: 2,
            title: "Business Intelligence com Power BI",
            excerpt: "Como criar dashboards eficientes para análise de dados empresariais...",
            status: "published",
            views: 203,
            author: "José Leite",
            categories: ["Power BI", "Analytics"],
            createdAt: new Date('2025-08-03')
          }
        ],
        recentPhotos: [
          {
            id: 1,
            title: "Pôr do sol em Coimbra",
            location: "Coimbra, Portugal",
            views: 89,
            imageUrl: "/api/placeholder/300/200",
            createdAt: new Date('2025-08-06')
          },
          {
            id: 2,
            title: "Arquitetura Moderna",
            location: "Porto, Portugal",
            views: 127,
            imageUrl: "/api/placeholder/300/200",
            createdAt: new Date('2025-08-04')
          }
        ]
      }

      return NextResponse.json(mockDashboardData)
    }

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
