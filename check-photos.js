const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wdfjvotfnwcsxsbysqgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTgyNDMsImV4cCI6MjA2OTU3NDI0M30.SKNKv7Y4lv4K8Tobx10ibPcV90ZF5r9A2x5EVQGdhOk'
);

async function checkPhotos() {
  try {
    console.log('Verificando fotos no banco...');
    
    // Buscar todas as fotos
    const { data: allPhotos, error: allError } = await supabase
      .from('photos')
      .select('id, title, published, imageUrl, publicId')
      .order('createdAt', { ascending: false });

    if (allError) {
      console.error('❌ Erro ao buscar todas as fotos:', allError);
      return;
    }

    console.log(`📊 Total de fotos no banco: ${allPhotos.length}`);
    
    // Fotos publicadas
    const publishedPhotos = allPhotos.filter(photo => photo.published);
    console.log(`✅ Fotos publicadas: ${publishedPhotos.length}`);
    
    // Fotos não publicadas
    const unpublishedPhotos = allPhotos.filter(photo => !photo.published);
    console.log(`❌ Fotos não publicadas: ${unpublishedPhotos.length}`);
    
    // Mostrar algumas fotos
    console.log('\n📸 Primeiras 5 fotos:');
    allPhotos.slice(0, 5).forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.title} - Publicada: ${photo.published} - ID: ${photo.id}`);
    });

    // Teste da consulta da API
    console.log('\n🔍 Testando consulta da API...');
    const { data: apiPhotos, error: apiError } = await supabase
      .from('photos')
      .select('*, photographer:photographerId(name, email)', { count: 'exact' })
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .range(0, 19);

    if (apiError) {
      console.error('❌ Erro na consulta da API:', apiError);
    } else {
      console.log(`✅ API retornou: ${apiPhotos.length} fotos`);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkPhotos();
