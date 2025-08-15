const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdfjvotfnwcsxsbysqgk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk5ODI0MywiZXhwIjoyMDY5NTc0MjQzfQ.l8TBnFBWoLeFkilDrRq01VOWkXyBgb1aMFVAz6DYqFc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugPhotos() {
  try {
    console.log('=== DEBUG: Verificando fotos na base de dados ===');
    
    // 1. Contar total de fotos
    const { count, error: countError } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true });
      
    console.log('Total de fotos no banco:', count);
    if (countError) console.error('Erro ao contar:', countError);
    
    // 2. Listar algumas fotos com publicId
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, title, publicId')
      .limit(10);
      
    console.log('Primeiras 10 fotos no banco:');
    photos?.forEach(photo => {
      console.log(`- ID: ${photo.id}, Título: ${photo.title}, PublicId: ${photo.publicId}`);
    });
    
    if (photosError) console.error('Erro ao buscar fotos:', photosError);
    
    // 3. Verificar se campo publicId existe e tem valores
    const { data: publicIds, error: publicError } = await supabase
      .from('photos')
      .select('publicId')
      .not('publicId', 'is', null)
      .limit(5);
      
    console.log('PublicIds encontrados:');
    publicIds?.forEach(p => console.log(`- ${p.publicId}`));
    
    if (publicError) console.error('Erro ao buscar publicIds:', publicError);
    
  } catch (error) {
    console.error('Erro no debug:', error);
  }
}

debugPhotos();
