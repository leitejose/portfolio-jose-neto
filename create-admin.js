import { createClient } from '../src/lib/supabase'

async function createAdminUser() {
  const supabase = createClient()

  try {
    // Primeiro, criar o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@portfolio.com',
      password: 'admin123',
      email_confirm: true
    })

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      return
    }

    console.log('✅ Usuário criado no Supabase Auth:', authData.user?.email)

    // Atualizar o perfil na tabela users
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .update({ 
          id: authData.user.id,
          role: 'ADMIN' 
        })
        .eq('email', 'admin@portfolio.com')

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError)
      } else {
        console.log('✅ Perfil de admin atualizado')
      }
    }

  } catch (error) {
    console.error('Erro geral:', error)
  }
}

createAdminUser()
