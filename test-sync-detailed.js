fetch('http://localhost:3001/api/photos/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => {
  console.log('Status da resposta:', response.status);
  console.log('Status text:', response.statusText);
  return response.text();
})
.then(text => {
  console.log('Resposta raw:', text);
  try {
    const data = JSON.parse(text);
    console.log('Resposta parsed:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('Erro ao parsear JSON:', e);
  }
})
.catch(error => {
  console.error('Erro na requisição:', error);
});
