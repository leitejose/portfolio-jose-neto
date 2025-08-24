export function PersonSchema() {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "José Neto",
    "jobTitle": "Programador Web",
    "description": "Programador Web especializado em React, TypeScript, NestJS e GraphQL. Mestrando em Sistemas de Informação de Gestão.",
    "url": "https://joseneto.tech",
    "image": "https://res.cloudinary.com/dvqzo7snh/image/upload/v1755253564/portfolio/portfolio/fotojose.jpg",
    "sameAs": [
      "https://github.com/leitejose",
      "https://www.linkedin.com/in/jos%C3%A9-leite-69318183/"
    ],
    "knowsAbout": [
      "React",
      "TypeScript",
      "NestJS",
      "GraphQL",
      "Next.js",
      "JavaScript",
      "Node.js",
      "Power BI",
      "Análise de Dados",
      "Desenvolvimento Web",
      "Frontend Development",
      "Backend Development"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Universidade/Instituto" // Adicione sua universidade
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelancer"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
    />
  )
}

export function WebsiteSchema() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": "José Neto - Portfolio",
    "description": "Portfolio profissional de José Neto, Programador Web especializado em React, TypeScript, NestJS e GraphQL.",
    "url": "https://joseneto.tech",
    "author": {
      "@type": "Person",
      "name": "José Neto"
    },
    "inLanguage": "pt-PT",
    "copyrightYear": new Date().getFullYear(),
    "genre": "Portfolio",
    "keywords": "programador web, desenvolvedor frontend, React, TypeScript, NestJS, GraphQL, portfolio"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  )
}
