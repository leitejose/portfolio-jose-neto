'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  postId: string
  initialViews: number
}

export default function ViewCounter({ postId, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    // Incrementar visualizações quando o componente monta
    const incrementViews = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/views`, {
          method: 'POST',
        })
        
        if (response.ok) {
          const data = await response.json()
          setViews(data.views)
        }
      } catch (error) {
        console.error('Erro ao incrementar visualizações:', error)
      }
    }

    incrementViews()
  }, [postId])

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      Visualizações: {views}
    </div>
  )
}
