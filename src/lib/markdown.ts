import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = await Promise.all(
    filenames.filter(name => name.endsWith('.md')).map(async (filename) => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const processedContent = await remark().use(html).process(content)
      return {
        id: filename.replace(/\.md$/, ''),
        slug: filename.replace(/\.md$/, ''),
        title: data.title || '',
        excerpt: data.description || '',
        content: processedContent.toString(),
        publishedAt: data.date || '',
        tags: data.tags || [],
        featured: data.featured || false,
      }
    })
  )

  // Ordena por data
  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}
