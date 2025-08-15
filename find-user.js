const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wdfjvotfnwcsxsbysqgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTEyNzEsImV4cCI6MjA3MDY4NzI3MX0.Ux-BxMnEt-tTlHfVqkqQBDACJbQdILWbPFPuojaMWr0'
);

async function findUser() {
  try {
    console.log('Procurando usuário José admin...');
    
    // Buscar por nome
    const { data: usersByName, error: nameError } = await supabase
      .from('User')
      .select('*')
      .ilike('name', '%josé%');

    if (nameError) {
      console.error('❌ Erro ao buscar por nome:', nameError);
    } else {
      console.log('Usuários encontrados por nome:', usersByName);
    }

    // Buscar todos os usuários para ver o que tem
    const { data: allUsers, error: allError } = await supabase
      .from('User')
      .select('*');

    if (allError) {
      console.error('❌ Erro ao buscar todos usuários:', allError);
    } else {
      console.log('Todos os usuários:', allUsers);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findUser();
