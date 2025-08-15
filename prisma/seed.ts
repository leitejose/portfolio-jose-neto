import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin real
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      name: 'José Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário admin criado:', adminUser.email)

  // Criar algumas categorias padrão
  const categoryNames = [
    'Sistemas',
    'Redes', 
    'Segurança',
    'Hardware',
    'Software',
    'Tutoriais',
    'Troubleshooting'
  ]

  const categories = []
  for (const categoryName of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-')
      }
    })
    categories.push(category)
  }

  console.log('✅ Categorias criadas:', categories.length)

  // Criar algumas fotos de exemplo
  const samplePhotos = [
    {
      title: 'Centro de Dados Moderno',
      description: 'Infraestrutura de TI de última geração com servidores e networking avançado',
      location: 'São Paulo, Brasil',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200',
      featured: true,
      views: 145
    },
    {
      title: 'Configuração de Rede',
      description: 'Setup profissional de equipamentos de rede e cabeamento estruturado',
      location: 'Rio de Janeiro, Brasil',
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=200',
      featured: false,
      views: 89
    },
    {
      title: 'Monitoramento de Sistemas',
      description: 'Dashboard de monitoramento em tempo real de infraestrutura crítica',
      location: 'Brasília, Brasil',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200',
      featured: true,
      views: 203
    }
  ]

  for (const photoData of samplePhotos) {
    const existingPhoto = await prisma.photo.findFirst({
      where: { title: photoData.title }
    })
    
    if (!existingPhoto) {
      await prisma.photo.create({
        data: {
          ...photoData,
          photographerId: adminUser.id
        }
      })
    }
  }

  console.log('✅ Fotos de exemplo criadas:', samplePhotos.length)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
