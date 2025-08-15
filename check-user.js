const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wdfjvotfnwcsxsbysqgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmp2b3Rmbndjc3hzYnlzcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTEyNzEsImV4cCI6MjA3MDY4NzI3MX0.Ux-BxMnEt-tTlHfVqkqQBDACJbQdILWbPFPuojaMWr0'
);

async function checkUser() {
  try {
    console.log('Verificando usuário admin...');
    
    const { data: users, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', 'admin@portfolio.com');

    if (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return;
    }

    if (users && users.length > 0) {
      console.log('✅ Usuário admin encontrado:', users[0]);
    } else {
      console.log('❌ Usuário admin não encontrado');
      
      // Vamos criar o usuário admin
      console.log('Criando usuário admin...');
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          email: 'admin@portfolio.com',
          name: 'Admin',
          password: 'admin123', // senha padrão
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar usuário:', createError);
      } else {
        console.log('✅ Usuário admin criado:', newUser);
      }
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkUser();
