const cloudinary = require('cloudinary').v2;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvqzo7snh',
  api_key: process.env.CLOUDINARY_API_KEY || '918446154732778',
  api_secret: process.env.CLOUDINARY_API_SECRET || '12Jz6NEtK9reP2wufRW8J2k-Uag'
});

async function debugCloudinaryPhotos() {
  try {
    console.log('=== DEBUG: Verificando fotos no Cloudinary ===');
    
    // Buscar fotos do Cloudinary
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 100,
      type: 'upload',
    });
    
    console.log(`Total de fotos no Cloudinary: ${result.resources?.length || 0}`);
    
    // Listar primeiras 10 fotos
    console.log('\nPrimeiras 10 fotos do Cloudinary:');
    result.resources?.slice(0, 10).forEach((photo, index) => {
      console.log(`${index + 1}. PublicId: ${photo.public_id}`);
      console.log(`   URL: ${photo.secure_url}`);
      console.log(`   Criado: ${photo.created_at}`);
      console.log('');
    });
    
    // Listar últimas 10 fotos
    console.log('\nÚltimas 10 fotos do Cloudinary:');
    result.resources?.slice(-10).forEach((photo, index) => {
      console.log(`${index + 1}. PublicId: ${photo.public_id}`);
      console.log(`   URL: ${photo.secure_url}`);
      console.log(`   Criado: ${photo.created_at}`);
      console.log('');
    });
    
    return result.resources;
    
  } catch (error) {
    console.error('Erro ao buscar fotos do Cloudinary:', error);
  }
}

debugCloudinaryPhotos();
