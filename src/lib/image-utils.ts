// Função para converter links do Google Drive em URLs diretos
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url

  // Se já é uma URL direta, retorna como está
  if (!url.includes('drive.google.com')) {
    return url
  }

  try {
    console.log('🔄 Convertendo URL do Google Drive:', url)
    
    // Padrão principal: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    
    if (fileIdMatch) {
      const fileId = fileIdMatch[1]
      const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
      console.log('✅ URL convertida com sucesso:', directUrl)
      return directUrl
    }

    // Padrão alternativo: https://drive.google.com/open?id=FILE_ID
    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    
    if (openIdMatch) {
      const fileId = openIdMatch[1]
      const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
      console.log('✅ URL convertida (padrão alternativo):', directUrl)
      return directUrl
    }

    // Se chegou até aqui, não conseguiu converter
    console.warn('⚠️ Não foi possível extrair ID do arquivo:', url)
    return url
  } catch (error) {
    console.error('❌ Erro ao converter URL do Google Drive:', error)
    return url
  }
}

// Função alternativa usando thumbnail do Google Drive
export function convertGoogleDriveUrlThumbnail(url: string): string {
  if (!url) return url

  if (!url.includes('drive.google.com')) {
    return url
  }

  try {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    
    if (fileIdMatch) {
      const fileId = fileIdMatch[1]
      // URL de thumbnail do Google Drive (geralmente funciona melhor)
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
    }

    return url
  } catch (error) {
    console.error('Erro ao converter URL para thumbnail:', error)
    return url
  }
}

// Função para validar se é uma URL válida de imagem
export function validateImageUrl(url: string): boolean {
  if (!url) return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Função para obter URL de imagem com proxy se necessário
export function getProxiedImageUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl
  
  // Se é uma URL do Google Drive, usar proxy
  if (originalUrl.includes('drive.google.com')) {
    const convertedUrl = convertGoogleDriveUrl(originalUrl)
    return `/api/image-proxy?url=${encodeURIComponent(convertedUrl)}`
  }
  
  // Para outras URLs que podem ter problemas de CORS
  if (originalUrl.includes('googleapis.com') || originalUrl.includes('googleusercontent.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
  }
  
  // URLs normais não precisam de proxy
  return originalUrl
}
