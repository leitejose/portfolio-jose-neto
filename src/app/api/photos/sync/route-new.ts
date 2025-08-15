import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Criar um cliente Supabase simples para teste
async function createSimpleSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    'https://wdfjvotfnwcsxsbysqgk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTEyNzEsImV4cCI6MjA3MDY4NzI3MX0.Ux-BxMnEt-tTlHfVqkqQBDACJbQdILWbPFPuojaMWr0'
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando sincronização de fotos do Cloudinary...');
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'undefined'
    });

    const supabase = await createSimpleSupabaseClient();

    // Primeiro, busca o usuário admin
    console.log('Buscando usuário admin...');
    const { data: adminUser, error: userError } = await supabase
      .from('User')
      .select('id, name, email')
      .eq('email', 'admin@portfolio.com')
      .single();

    console.log('Resultado da busca:', { adminUser, userError });

    if (userError || !adminUser) {
      console.error('Erro ao buscar usuário:', userError);
      return NextResponse.json(
        { 
          error: 'Usuário admin não encontrado',
          details: userError?.message || 'Não foi possível encontrar o usuário admin@portfolio.com'
        },
        { status: 400 }
      );
    }

    console.log('Usuário admin encontrado:', adminUser);

    // Busca fotos no Cloudinary
    console.log('Buscando fotos no Cloudinary...');
    const cloudinaryPhotos = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 100,
      type: 'upload',
    });

    console.log(`Cloudinary retornou ${cloudinaryPhotos.resources?.length || 0} fotos`);

    if (!cloudinaryPhotos.resources || cloudinaryPhotos.resources.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma foto encontrada no Cloudinary.',
        stats: { synced: 0, skipped: 0, total: 0 }
      });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    console.log(`Processando ${cloudinaryPhotos.resources.length} fotos do Cloudinary`);

    // Processa cada foto
    for (const cloudinaryPhoto of cloudinaryPhotos.resources) {
      try {
        console.log(`Processando foto: ${cloudinaryPhoto.public_id}`);
        
        // Verifica se a foto já existe
        const { data: existingPhoto } = await supabase
          .from('Photo')
          .select('id')
          .eq('publicId', cloudinaryPhoto.public_id)
          .single();

        if (existingPhoto) {
          skippedCount++;
          console.log(`Foto já existe: ${cloudinaryPhoto.public_id}`);
          continue;
        }

        // Extrai informações da foto
        const title = cloudinaryPhoto.public_id.split('/').pop() || 'Untitled';
        const description = cloudinaryPhoto.context?.caption || '';
        const location = cloudinaryPhoto.context?.location || '';

        // Cria nova foto no banco
        const photoData = {
          title,
          description,
          imageUrl: cloudinaryPhoto.secure_url,
          publicId: cloudinaryPhoto.public_id,
          location,
          published: true,
          takenAt: cloudinaryPhoto.created_at ? new Date(cloudinaryPhoto.created_at).toISOString() : new Date().toISOString(),
          photographerId: adminUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log(`Inserindo foto no banco:`, { title, publicId: cloudinaryPhoto.public_id });

        const { error: insertError } = await supabase
          .from('Photo')
          .insert(photoData);

        if (insertError) {
          console.error(`Erro ao inserir foto ${cloudinaryPhoto.public_id}:`, insertError);
          continue;
        }

        syncedCount++;
        console.log(`✅ Foto sincronizada: ${title}`);

      } catch (photoError) {
        console.error(`Erro ao processar foto ${cloudinaryPhoto.public_id}:`, photoError);
        // Continua com a próxima foto mesmo se uma falhar
      }
    }

    const result = {
      success: true,
      message: `Sincronização concluída! ${syncedCount} fotos adicionadas, ${skippedCount} já existiam.`,
      stats: {
        synced: syncedCount,
        skipped: skippedCount,
        total: cloudinaryPhotos.resources.length
      }
    };

    console.log('Resultado final:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro geral ao sincronizar fotos:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao sincronizar fotos do Cloudinary',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
