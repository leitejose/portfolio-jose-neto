import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePhotos() {
  try {
    console.log('🔄 Atualizando fotos para publicadas...')
    
    const result = await prisma.photo.updateMany({
      where: {
        published: false
      },
      data: {
        published: true
      }
    })
    
    console.log(`✅ ${result.count} fotos atualizadas para publicadas`)
    
    // Verificar total de fotos
    const totalPhotos = await prisma.photo.count()
    console.log(`📸 Total de fotos no banco: ${totalPhotos}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePhotos()
