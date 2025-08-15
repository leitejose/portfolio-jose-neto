const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dvqzo7snh',
  api_key: '918446154732778',
  api_secret: '12Jz6NEtK9reP2wufRW8J2k-Uag',
});

async function testCloudinary() {
  try {
    console.log('Testando conexão com Cloudinary...');
    
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 5,
      type: 'upload',
    });

    console.log('✅ Cloudinary conectado!');
    console.log(`Encontradas ${result.resources.length} fotos:`);
    
    result.resources.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.public_id} - ${photo.secure_url}`);
    });

  } catch (error) {
    console.error('❌ Erro ao conectar com Cloudinary:', error.message);
  }
}

testCloudinary();
