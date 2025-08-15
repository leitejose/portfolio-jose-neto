import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    console.log('Testando credenciais do Cloudinary...');
    
    // Teste simples - listar recursos
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 1,
      type: 'upload',
    });

    return NextResponse.json({
      success: true,
      message: 'Credenciais do Cloudinary estão corretas!',
      totalImages: result.resources.length,
      cloudConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        has_secret: !!process.env.CLOUDINARY_API_SECRET
      }
    });

  } catch (error: any) {
    console.error('Erro ao testar Cloudinary:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.error || error,
      cloudConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        has_secret: !!process.env.CLOUDINARY_API_SECRET
      }
    }, { status: 500 });
  }
}
