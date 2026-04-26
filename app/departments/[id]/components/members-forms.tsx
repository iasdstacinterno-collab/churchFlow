'use client'

import { useState } from 'react'
import { addMember, removeMember } from '../actions'
import { Button } from '@/components/ui/button'

export function AddMemberForm({ departmentId, users }: { departmentId: string, users: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('department_id', departmentId)
    const result = await addMember(formData)
    
    if (result?.error) setError(result.error)
    else ;(e.target as HTMLFormElement).reset()
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mb-6">
      <select name="user_id" required className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
        <option value="">Selecione um membro...</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name || u.id} ({u.role})</option>
        ))}
      </select>
      <Button type="submit" disabled={loading}>Adicionar Membro</Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}

export function RemoveMemberButton({ id, departmentId }: { id: string, departmentId: string }) {
  const [loading, setLoading] = useState(false)
  const handleRemove = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('id', id)
    formData.append('department_id', departmentId)
    await removeMember(formData)
    setLoading(false) // Component unmounts so no need to reset unless fail, mvp simple.
  }
  return (
    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" disabled={loading} onClick={handleRemove}>
      Remover
    </Button>
  )
}
