'use client'

import { useState } from 'react'
import { createDepartment } from '../actions'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export function CreateDepartmentForm({ users }: { users: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await createDepartment(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      ; (e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <Input name="name" placeholder="Novo Departamento" required disabled={loading} className="w-48" />
      <select name="leader_id" className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
        <option value="">Sem Líder</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name || u.id} ({u.role})</option>
        ))}
      </select>
      <Button type="submit" disabled={loading}>Criar</Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
