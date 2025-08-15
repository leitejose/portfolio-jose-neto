import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando sincronização de fotos do Cloudinary...');
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'undefined'
    });

    // Criar cliente Supabase para API do servidor
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Primeiro, busca o usuário admin
    console.log('Buscando usuário admin...');
    const { data: adminUser, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('email', 'admin@portfolio.com')
      .single();

    if (userError || !adminUser) {
      console.error('Erro ao buscar usuário:', userError);
      return NextResponse.json(
        { error: 'Usuário admin não encontrado. Execute o seed do banco primeiro.' },
        { status: 400 }
      );
    }

    console.log('Usuário admin encontrado:', adminUser);

    // Busca fotos no Cloudinary
    const cloudinaryPhotos = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 100,
      type: 'upload',
    });

    if (!cloudinaryPhotos.resources || cloudinaryPhotos.resources.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma foto encontrada no Cloudinary.',
        stats: { synced: 0, skipped: 0, total: 0 }
      });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    console.log(`Encontradas ${cloudinaryPhotos.resources.length} fotos no Cloudinary`);

    // Processa cada foto
    for (const cloudinaryPhoto of cloudinaryPhotos.resources) {
      try {
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
        const { error: insertError } = await supabase
          .from('Photo')
          .insert({
            title,
            description,
            imageUrl: cloudinaryPhoto.secure_url,
            publicId: cloudinaryPhoto.public_id,
            location,
            published: true,
            takenAt: cloudinaryPhoto.created_at ? new Date(cloudinaryPhoto.created_at).toISOString() : new Date().toISOString(),
            photographerId: adminUser.id
          });

        if (insertError) {
          console.error(`Erro ao inserir foto ${cloudinaryPhoto.public_id}:`, insertError);
          continue;
        }

        syncedCount++;
        console.log(`Foto sincronizada: ${title}`);

      } catch (photoError) {
        console.error(`Erro ao processar foto ${cloudinaryPhoto.public_id}:`, photoError);
        // Continua com a próxima foto mesmo se uma falhar
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída! ${syncedCount} fotos adicionadas, ${skippedCount} já existiam.`,
      stats: {
        synced: syncedCount,
        skipped: skippedCount,
        total: cloudinaryPhotos.resources.length
      }
    });

  } catch (error) {
    console.error('Erro ao sincronizar fotos:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar fotos do Cloudinary' },
      { status: 500 }
    );
  }
}
