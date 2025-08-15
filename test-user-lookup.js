const { createClient } = require('@supabase/supabase-js');

console.log('Testando lookup do usuário...');

// Configuração do Supabase - usando as mesmas variáveis que a API
const supabaseUrl = 'https://wdfjvotfnwcsxsbysqgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTY0ODUsImV4cCI6MjA1MzEzMjQ4NX0.DGDIWnIEjMOdeLdPiR6tOcJPLKlPk7wNOJ6zQi8XGKM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserLookup() {
  try {
    console.log('1. Testando select simples...');
    
    // Teste 1: Select básico
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('*');
      
    console.log('Todos os usuários:', allUsers);
    console.log('Erro:', allError);
    
    console.log('\n2. Testando busca por email...');
    
    // Teste 2: Busca por email
    const { data: userByEmail, error: emailError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', 'admin@portfolio.com');
      
    console.log('Usuário por email:', userByEmail);
    console.log('Erro email:', emailError);
    
    console.log('\n3. Testando com maybeSingle...');
    
    // Teste 3: Com maybeSingle
    const { data: singleUser, error: singleError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', 'admin@portfolio.com')
      .maybeSingle();
      
    console.log('Usuário single:', singleUser);
    console.log('Erro single:', singleError);
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testUserLookup();
