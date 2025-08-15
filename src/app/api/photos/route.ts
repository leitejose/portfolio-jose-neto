import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isAdmin = searchParams.get('admin') === 'true'
    
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('photos')
      .select('*, photographer:photographerId(name, email)', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to)

    // Filtrar por publicação se não for admin
    if (!isAdmin) {
      query = query.eq('published', true)
    }

    // Adicionar busca se fornecida
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
    }

    const { data: photos, count, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Erro ao carregar fotos' }, { status: 500 })
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      photos: photos || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
