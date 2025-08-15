const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdfjvotfnwcsxsbysqgk.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTgyNDMsImV4cCI6MjA2OTU3NDI0M30.SKNKv7Y4lv4K8Tobx10ibPcV90ZF5r9A2x5EVQGdhOk'
);

async function testAdminSearch() {
  console.log('Verificando dados na tabela users...\n');
  
  // Listar todos os usuários
  const { data: allUsers, error: allError } = await supabase
    .from('users')
    .select('*');
    
  if (allError) {
    console.error('Erro ao buscar todos os usuários:', allError);
    return;
  }
  
  console.log('Todos os usuários encontrados:');
  console.log('Total:', allUsers?.length || 0);
  allUsers?.forEach((user, index) => {
    console.log(`${index + 1}. ID: ${user.id}, Email: "${user.email}", Role: ${user.role}`);
  });
  
  console.log('\n---\n');
  
  // Buscar especificamente o admin
  const { data: adminUser, error: adminError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'admin@portfolio.com')
    .maybeSingle();
    
  console.log('Busca por admin@portfolio.com:');
  if (adminError) {
    console.error('Erro:', adminError);
  } else if (adminUser) {
    console.log('Usuário encontrado:', adminUser);
  } else {
    console.log('Nenhum usuário encontrado com esse email');
  }
  
  // Verificar se existem emails similares
  console.log('\n---\n');
  const { data: similarEmails, error: similarError } = await supabase
    .from('users')
    .select('*')
    .ilike('email', '%admin%');
    
  console.log('Emails contendo "admin":');
  if (similarError) {
    console.error('Erro:', similarError);
  } else {
    console.log('Encontrados:', similarEmails?.length || 0);
    similarEmails?.forEach(user => {
      console.log(`- Email: "${user.email}", Role: ${user.role}`);
    });
  }
}

testAdminSearch().catch(console.error);
