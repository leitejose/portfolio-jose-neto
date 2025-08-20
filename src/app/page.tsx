import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Projects } from '@/components/projects'
import { Contact } from '@/components/contact'
import { PersonSchema, WebsiteSchema } from '@/components/structured-data'

export default function Home() {
  return (
    <>
      <PersonSchema />
      <WebsiteSchema />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  )
}
