async function testAPI() {
  try {
    console.log('Testando API /api/photos...');
    
    const response = await fetch('http://localhost:3000/api/photos?page=1&limit=20');
    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', JSON.stringify(data, null, 2));
    
    if (data.photos) {
      console.log(`Número de fotos retornadas: ${data.photos.length}`);
      console.log('Primeira foto:', data.photos[0]);
    } else {
      console.log('❌ Propriedade "photos" não encontrada na resposta');
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

testAPI();
