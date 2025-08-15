async function testSyncAPI() {
  try {
    console.log('Testando API de sincronização...');
    
    const response = await fetch('http://localhost:3000/api/photos/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Status text:', response.statusText);
    
    const data = await response.json();
    console.log('Resposta completa:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

testSyncAPI();
