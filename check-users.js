const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdfjvotfnwcsxsbysqgk.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTgyNDMsImV4cCI6MjA2OTU3NDI0M30.SKNKv7Y4lv4K8Tobx10ibPcV90ZF5r9A2x5EVQGdhOk'
);

async function checkUsers() {
  try {
    console.log('Verificando todos os usuários...');
    
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('*');

    if (allError) {
      console.error('❌ Erro ao buscar todos os usuários:', allError);
      return;
    }

    console.log(`📊 Total de usuários: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email}, Nome: ${user.name}`);
    });

    // Buscar especificamente por admin@portfolio.com
    console.log('\n🔍 Buscando admin@portfolio.com...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@portfolio.com');

    if (adminError) {
      console.error('❌ Erro ao buscar admin:', adminError);
    } else {
      console.log(`✅ Usuários admin encontrados: ${adminUsers.length}`);
      adminUsers.forEach(user => {
        console.log(`- ID: ${user.id}, Email: ${user.email}, Nome: ${user.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkUsers();
