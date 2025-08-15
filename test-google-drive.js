// Teste da função convertGoogleDriveUrl
import { convertGoogleDriveUrl } from '../lib/image-utils'

// Teste com URLs diferentes
const testUrls = [
  'https://drive.google.com/file/d/1ABCxyz123/view?usp=sharing',
  'https://drive.google.com/file/d/1ABCxyz123/view',
  'https://drive.google.com/open?id=1ABCxyz123',
  'https://example.com/image.jpg' // URL normal
]

console.log('🧪 Testando conversão de URLs:')
testUrls.forEach(url => {
  const converted = convertGoogleDriveUrl(url)
  console.log(`Original: ${url}`)
  console.log(`Convertida: ${converted}`)
  console.log('---')
})
