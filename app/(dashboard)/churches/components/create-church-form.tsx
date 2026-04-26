'use client'

import { useState } from 'react'
import { createChurch } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CreateChurchForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await createChurch(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input name="name" placeholder="Nova Igreja" required disabled={loading} />
      <Button type="submit" disabled={loading}>Criar Igreja</Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
