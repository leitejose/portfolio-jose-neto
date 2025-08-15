const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wdfjvotfnwcsxsbysqgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk5ODI0MywiZXhwIjoyMDY5NTc0MjQzfQ.l8TBnFBWoLeFkilDrRq01VOWkXyBgb1aMFVAz6DYqFc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSpecificPhoto() {
  try {
    console.log('=== TESTANDO VERIFICAÇÃO DE FOTO ESPECÍFICA ===\n');
    
    // Testar uma foto que deveria ser nova (do Cloudinary)
    const testPublicId = 'IMG_8962_uypty6';
    
    console.log(`Testando publicId: ${testPublicId}`);
    
    const { data: existingPhoto, error: checkError } = await supabase
      .from('photos')
      .select('id')
      .eq('publicId', testPublicId)
      .maybeSingle();

    console.log('Resultado da busca:', { existingPhoto, checkError });
    
    if (existingPhoto) {
      console.log('❌ Foto foi encontrada (não deveria!)');
    } else {
      console.log('✅ Foto não foi encontrada (correto, é nova)');
    }
    
    // Vamos testar também com uma foto que existe
    const existingPublicId = 'IMG_7707_pes6kv';
    console.log(`\nTestando publicId existente: ${existingPublicId}`);
    
    const { data: shouldExist, error: shouldExistError } = await supabase
      .from('photos')
      .select('id')
      .eq('publicId', existingPublicId)
      .maybeSingle();

    console.log('Resultado da busca (deveria existir):', { shouldExist, shouldExistError });
    
    if (shouldExist) {
      console.log('✅ Foto existente foi encontrada (correto)');
    } else {
      console.log('❌ Foto existente não foi encontrada (erro!)');
    }
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testSpecificPhoto();
