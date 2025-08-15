require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key existe:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Testar com o nome da tabela correta
    const { data, error } = await supabase.from('photos').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Erro na consulta:', error)
    } else {
      console.log('Conexão bem-sucedida! Total de registros:', data)
    }

    // Teste adicional - buscar algumas fotos
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, title')
      .limit(5)
    
    if (photosError) {
      console.error('Erro ao buscar fotos:', photosError)
    } else {
      console.log('Fotos encontradas:', photos?.length || 0)
      if (photos && photos.length > 0) {
        console.log('Primeiras fotos:', photos)
      }
    }
  } catch (err) {
    console.error('Erro de conexão:', err)
  }
}

testConnection()
