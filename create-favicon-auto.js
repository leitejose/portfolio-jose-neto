// Script automatizado para criar favicon
// Execute: npm install sharp && node create-favicon-auto.js

const sharp = require('sharp')
const path = require('path')

async function createFavicon() {
  try {
    console.log('🎯 Criando favicon a partir da sua foto...')
    
    // Criar favicon 32x32
    await sharp('./public/fotojose.jpeg')
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile('./public/favicon-32x32.png')
    
    // Criar favicon 16x16
    await sharp('./public/fotojose.jpeg')
      .resize(16, 16, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile('./public/favicon-16x16.png')
    
    // Criar apple-touch-icon
    await sharp('./public/fotojose.jpeg')
      .resize(180, 180, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile('./public/apple-touch-icon.png')
    
    console.log('✅ Favicons criados com sucesso!')
    console.log('📁 Arquivos gerados:')
    console.log('   - favicon-16x16.png')
    console.log('   - favicon-32x32.png') 
    console.log('   - apple-touch-icon.png')
    console.log('')
    console.log('🔄 Atualizando layout.tsx...')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.log('💡 Instale o Sharp primeiro: npm install sharp')
  }
}

createFavicon()
