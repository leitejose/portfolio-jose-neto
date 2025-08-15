fetch('http://localhost:3000/api/photos/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Resultado da sincronização:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Erro:', error);
});
