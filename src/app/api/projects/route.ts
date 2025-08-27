import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ apenas no backend
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const from = (page - 1) * limit
    const to = from + limit - 1

    // monta query
    let query = supabase.from('projects').select('*', { count: 'exact' }).order('order', { ascending: true })

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalPages = count ? Math.ceil(count / limit) : 1

    return NextResponse.json({
      projects: data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (err) {
    console.error('Projects API error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, content, imageUrl, demoUrl, repoUrl, featured, published, order } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios: title, description' }, { status: 400 })
    }

    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const now = new Date().toISOString()

    const projectData = {
      id: `project_${Date.now()}`,
      title,
      slug,
      description,
      content: content || description,
      imageUrl,
      demoUrl,
      repoUrl,
      featured: featured || false,
      published: published !== false,
      order: order || 0,
      createdAt: now,
      updatedAt: now,
    }

    const { data, error } = await supabase.from('projects').insert([projectData]).select().single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error creating project:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
