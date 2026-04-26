'use client'

import { useState } from 'react'
import { createSchedule, addScheduleRole, removeScheduleRole } from '../actions'
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

export function ManageScheduleRolesForm({ scheduleId, members }: { scheduleId: string, members: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('schedule_id', scheduleId)
    const result = await addScheduleRole(formData)
    if (result?.error) setError(result.error)
    else ;(e.target as HTMLFormElement).reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-3">
      <Input name="role_name" placeholder="Função Ex: Bateria" required disabled={loading} className="w-32 h-8 text-sm" />
      <select name="user_id" className="h-8 text-sm rounded-md border border-input bg-transparent px-2" disabled={loading}>
        <option value="">Sem membro (Nenhum)</option>
        {members.map(m => (
          <option key={m.user_id} value={m.user_id}>{m.profile?.name || m.user_id}</option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={loading} variant="secondary">Adicionar Função</Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}

export function RemoveRoleButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  return (
    <Button variant="ghost" size="sm" className="text-destructive h-6 px-2 text-xs" disabled={loading} onClick={async () => {
      setLoading(true)
      const form = new FormData()
      form.append('id', id)
      await removeScheduleRole(form)
      setLoading(false)
    }}>X</Button>
  )
}
