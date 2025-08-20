import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ posts: data || [] }, { status: 200 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor', details: err }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, content, excerpt, published = false, featured = false, coverImage } = body

    // Gerar slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const postData = {
      title,
      content,
      excerpt,
      slug,
      published,
      featured,
      coverImage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: published ? new Date().toISOString() : null,
      views: 0,
      readTime: Math.ceil(content.split(' ').length / 200)
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ post: post?.[0] }, { status: 201 })
  } catch (err) {
    console.error('API POST error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor', details: err }, { status: 500 })
  }
}
