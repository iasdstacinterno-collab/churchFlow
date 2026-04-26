'use client'

import { useState } from 'react'
import { createSchedule, assignRole } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateScheduleForm({ departmentId }: { departmentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('department_id', departmentId)
    const result = await createSchedule(formData)
    
    if (result?.error) setError(result.error)
    else ;(e.target as HTMLFormElement).reset()
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-muted/30 rounded-lg border">
      <h3 className="font-medium">Criar Nova Escala</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs">Tipo de Evento</Label>
          <Input name="event_type" placeholder="Ex: Culto da Família" required disabled={loading} />
        </div>
        <div>
          <Label className="text-xs">Data</Label>
          <Input type="date" name="date" required disabled={loading} />
        </div>
        <div>
           <Label className="text-xs">Início</Label>
           <Input type="time" name="start_time" required disabled={loading} />
        </div>
        <div>
           <Label className="text-xs">Término</Label>
           <Input type="time" name="end_time" required disabled={loading} />
        </div>
      </div>
      <div>
        <Button type="submit" disabled={loading}>Criar Escala</Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </form>
  )
}

export function CreateRoleForm({ scheduleId, members }: { scheduleId: string, members: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('schedule_id', scheduleId)
    const result = await assignRole(formData)
    if (result?.error) setError(result.error)
    else ;(e.target as HTMLFormElement).reset()
    setLoading(false)
  }

  return (
    <div className="mt-4 pt-4 border-t border-dashed">
      <h5 className="font-medium text-sm mb-2 text-muted-foreground">Adicionar Nova Função</h5>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input name="role_name" placeholder="Ex: Bateria" required disabled={loading} className="w-32 h-8 text-sm" />
        <select name="member_id" className="h-8 text-sm rounded-md border border-input bg-transparent px-2" disabled={loading}>
          <option value="">Sem membro (Nenhum)</option>
          {members.map(m => (
            <option key={m.member_id} value={m.member_id}>{m.member?.name || m.member_id}</option>
          ))}
        </select>
        <Button type="submit" size="sm" disabled={loading} variant="secondary">Criar Função</Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  )
}

export function AddMemberToRoleForm({ scheduleId, roleName, members }: { scheduleId: string, roleName: string, members: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('schedule_id', scheduleId)
    formData.append('role_name', roleName) // Pre-filled from the role group
    const result = await assignRole(formData)
    if (result?.error) setError(result.error)
    else ;(e.target as HTMLFormElement).reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center ml-2">
      <select name="member_id" className="h-6 text-xs text-muted-foreground rounded-md border border-input bg-transparent px-1 min-w-[120px]" required disabled={loading}>
        <option value="">+ Selecionar Membro</option>
        {members.map(m => (
          <option key={m.member_id} value={m.member_id}>{m.member?.name || m.member_id}</option>
        ))}
      </select>
      <Button type="submit" size="sm" className="h-6 text-[10px] px-2 py-0" disabled={loading} variant="outline">Adicionar</Button>
      {error && <span className="text-red-500 text-[10px]">{error}</span>}
    </form>
  )
}

