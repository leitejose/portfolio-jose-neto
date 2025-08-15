import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return Response.json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
