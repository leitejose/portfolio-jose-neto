const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

// Configuração do Supabase
const supabaseUrl = 'https://wdfjvotfnwcsxsbysqgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk5ODI0MywiZXhwIjoyMDY5NTc0MjQzfQ.l8TBnFBWoLeFkilDrRq01VOWkXyBgb1aMFVAz6DYqFc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'dvqzo7snh',
  api_key: '918446154732778',
  api_secret: '12Jz6NEtK9reP2wufRW8J2k-Uag'
});

async function comparePhotos() {
  try {
    console.log('=== COMPARANDO FOTOS: Banco vs Cloudinary ===\n');
    
    // 1. Buscar fotos do banco
    const { data: dbPhotos, error: dbError } = await supabase
      .from('photos')
      .select('publicId')
      .order('createdAt', { ascending: false });
      
    if (dbError) {
      console.error('Erro ao buscar fotos do banco:', dbError);
      return;
    }
    
    console.log(`Fotos no banco: ${dbPhotos.length}`);
    const dbPublicIds = new Set(dbPhotos.map(p => p.publicId));
    
    // 2. Buscar fotos do Cloudinary
    const cloudResult = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 100,
      type: 'upload',
    });
    
    console.log(`Fotos no Cloudinary: ${cloudResult.resources?.length || 0}\n`);
    
    // 3. Comparar
    const cloudinaryPublicIds = cloudResult.resources?.map(r => r.public_id) || [];
    
    console.log('=== FOTOS QUE ESTÃO NO CLOUDINARY MAS NÃO NO BANCO ===');
    const missingInDb = cloudinaryPublicIds.filter(id => !dbPublicIds.has(id));
    console.log(`Total: ${missingInDb.length} fotos`);
    missingInDb.slice(0, 10).forEach((id, index) => {
      console.log(`${index + 1}. ${id}`);
    });
    
    if (missingInDb.length > 10) {
      console.log(`... e mais ${missingInDb.length - 10} fotos`);
    }
    
    console.log('\n=== FOTOS QUE ESTÃO NO BANCO MAS NÃO NO CLOUDINARY ===');
    const missingInCloudinary = dbPhotos.filter(p => !cloudinaryPublicIds.includes(p.publicId));
    console.log(`Total: ${missingInCloudinary.length} fotos`);
    missingInCloudinary.slice(0, 10).forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.publicId}`);
    });
    
    console.log('\n=== RESUMO ===');
    console.log(`Fotos no banco: ${dbPhotos.length}`);
    console.log(`Fotos no Cloudinary: ${cloudResult.resources?.length || 0}`);
    console.log(`Fotos para sincronizar: ${missingInDb.length}`);
    
  } catch (error) {
    console.error('Erro na comparação:', error);
  }
}

comparePhotos();
