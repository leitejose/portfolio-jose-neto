import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Criar um cliente Supabase usando as variáveis de ambiente
async function createSimpleSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      .from('users')
      .select('id, name, email')
      .eq('email', 'admin@portfolio.com')
      .maybeSingle();

    console.log('Resultado da busca:', { adminUser, userError });

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return NextResponse.json(
        { 
          error: 'Erro ao buscar usuário admin',
          details: userError.message
        },
        { status: 400 }
      );
    }

    if (!adminUser) {
      console.error('Usuário admin não encontrado');
      return NextResponse.json(
        { 
          error: 'Usuário admin não encontrado',
          details: 'Não foi possível encontrar o usuário admin@portfolio.com'
        },
        { status: 400 }
      );
    }

    console.log('Usuário admin encontrado:', adminUser);

    // Busca fotos no Cloudinary (excluindo fotos de projetos)
    console.log('Buscando fotos no Cloudinary...');
    const cloudinaryPhotos = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 100,
      type: 'upload',
      // Exclui fotos com tag "project" ou que estejam na pasta "projects"
      prefix: '', // busca em todas as pastas
    });

    console.log(`Cloudinary retornou ${cloudinaryPhotos.resources?.length || 0} fotos`);

    // Filtra fotos que não são de projetos
    const personalPhotos = cloudinaryPhotos.resources?.filter((photo: any) => {
      // Exclui se tiver tag "project" ou se estiver na pasta "projects"
      const hasProjectTag = photo.tags?.includes('project');
      const isInProjectsFolder = photo.public_id.startsWith('projects/');
      
      return !hasProjectTag && !isInProjectsFolder;
    }) || [];

    console.log(`Filtradas ${personalPhotos.length} fotos pessoais (excluindo ${(cloudinaryPhotos.resources?.length || 0) - personalPhotos.length} fotos de projetos)`);

    if (personalPhotos.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma foto pessoal encontrada no Cloudinary (fotos de projetos foram excluídas).',
        stats: { synced: 0, skipped: 0, total: 0 }
      });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    console.log(`Processando ${personalPhotos.length} fotos pessoais do Cloudinary`);

    // Processa cada foto pessoal
    for (const cloudinaryPhoto of personalPhotos) {
      try {
        console.log(`📷 Processando foto: ${cloudinaryPhoto.public_id}`);
        
        // Verifica se a foto já existe
        const { data: existingPhoto, error: checkError } = await supabase
          .from('photos')
          .select('id')
          .eq('publicId', cloudinaryPhoto.public_id)
          .maybeSingle();

        console.log(`🔍 Verificação para ${cloudinaryPhoto.public_id}:`, { 
          existe: !!existingPhoto, 
          id: existingPhoto?.id,
          erro: checkError 
        });

        if (checkError) {
          console.error(`❌ Erro na verificação de ${cloudinaryPhoto.public_id}:`, checkError);
          continue;
        }

        if (existingPhoto) {
          skippedCount++;
          console.log(`⏭️ Foto já existe: ${cloudinaryPhoto.public_id}`);
          continue;
        }

        console.log(`🆕 Foto nova detectada: ${cloudinaryPhoto.public_id}`);

        // Extrai informações da foto
        const title = cloudinaryPhoto.public_id.split('/').pop() || 'Untitled';
        const description = cloudinaryPhoto.context?.caption || '';
        const location = cloudinaryPhoto.context?.location || '';

        // Gerar um ID único (similar ao cuid())
        function generateCuid() {
          const timestamp = Date.now().toString(36);
          const randomStr = Math.random().toString(36).substring(2, 15);
          return `cm${timestamp}${randomStr}`;
        }

        // Cria nova foto no banco
        const photoData = {
          id: generateCuid(), // Gerar ID único
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

        console.log(`📷 Dados da foto a inserir:`, photoData);

        const { data: insertedPhoto, error: insertError } = await supabase
          .from('photos')
          .insert(photoData)
          .select();

        if (insertError) {
          console.error(`❌ Erro ao inserir foto ${cloudinaryPhoto.public_id}:`, insertError);
          continue;
        }

        syncedCount++;
        console.log(`✅ Foto sincronizada com sucesso:`, { title, id: insertedPhoto?.[0]?.id });

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
