const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'dvqzo7snh',
  api_key: '918446154732778',
  api_secret: '12Jz6NEtK9reP2wufRW8J2k-Uag'
});

async function uploadImages() {
  try {
    console.log('📸 Uploading images to Cloudinary...');
    
    // Upload foto do perfil
    const photoResult = await cloudinary.uploader.upload(
      path.join(__dirname, 'public', 'fotojose.jpeg'),
      {
        public_id: 'portfolio/fotojose',
        folder: 'portfolio',
        resource_type: 'image'
      }
    );
    
    console.log('✅ Foto uploaded:', photoResult.secure_url);
    
    // Upload logo
    const logoResult = await cloudinary.uploader.upload(
      path.join(__dirname, 'public', 'logo.png'),
      {
        public_id: 'portfolio/logo',
        folder: 'portfolio',
        resource_type: 'image'
      }
    );
    
    console.log('✅ Logo uploaded:', logoResult.secure_url);
    
    console.log('\n🎉 All images uploaded successfully!');
    console.log('Foto URL:', photoResult.secure_url);
    console.log('Logo URL:', logoResult.secure_url);
    
  } catch (error) {
    console.error('❌ Error uploading images:', error);
  }
}

uploadImages();
