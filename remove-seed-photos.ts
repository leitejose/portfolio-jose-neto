import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeSeedPhotos() {
  try {
    console.log('🗑️ Removendo fotos do seed...')

    // Títulos das fotos do seed para remover
    const seedPhotoTitles = [
      'Infraestrutura de Rede',
      'Monitoramento de Sistemas',
      'Centro de Dados Moderno',
      'Configuração de Rede'
    ]

    // Deletar fotos do seed
    const deleteResult = await prisma.photo.deleteMany({
      where: {
        title: {
          in: seedPhotoTitles
        }
      }
    })

    console.log(`✅ ${deleteResult.count} fotos do seed removidas com sucesso!`)

    // Mostrar quantas fotos restaram
    const remainingPhotos = await prisma.photo.count()
    console.log(`📸 Fotos restantes no banco: ${remainingPhotos}`)

    // Listar as fotos restantes
    const photos = await prisma.photo.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        published: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\n📋 Fotos restantes:')
    photos.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.title} - ${photo.location || 'Sem localização'} ${photo.published ? '(Publicada)' : '(Rascunho)'}`)
    })

  } catch (error) {
    console.error('❌ Erro ao remover fotos do seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeSeedPhotos()
