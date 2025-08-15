const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'dvqzo7snh',
  api_key: '918446154732778',
  api_secret: '12Jz6NEtK9reP2wufRW8J2k-Uag'
});

async function uploadBlackLogo() {
  try {
    console.log('📸 Uploading black logo to Cloudinary...');
    
    // Upload logo em preto
    const logoBlackResult = await cloudinary.uploader.upload(
      path.join(__dirname, 'public', 'logo em preto.png'),
      {
        public_id: 'portfolio/logo-black',
        folder: 'portfolio',
        resource_type: 'image'
      }
    );
    
    console.log('✅ Logo Black uploaded:', logoBlackResult.secure_url);
    
    console.log('\n🎉 Black logo uploaded successfully!');
    console.log('Logo Black URL:', logoBlackResult.secure_url);
    
  } catch (error) {
    console.error('❌ Error uploading logo:', error);
  }
}

uploadBlackLogo();
