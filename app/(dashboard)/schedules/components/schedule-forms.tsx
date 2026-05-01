'use client'

import { useState } from 'react'
import { createSchedule, assignRole } from '../actions'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Plus, CalendarDays, Clock } from 'lucide-react'

export function CreateScheduleModal({
  departmentId,
  trigger,
  onSuccess
}: {
  departmentId: string,
  trigger?: React.ReactElement,
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('department_id', departmentId)
    const result = await createSchedule(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
      if (onSuccess) onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" /> Nova Escala
        </Button>
      )} />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Escala</DialogTitle>
            <DialogDescription>
              Agende um novo evento e defina o horário de início e término.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="event_type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo de Evento</Label>
              <Input id="event_type" name="event_type" placeholder="Ex: Culto da Família, Ensaio..." required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data</Label>
              <Input id="date" type="date" name="date" required disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Início
                </Label>
                <Input id="start_time" type="time" name="start_time" required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Término
                </Label>
                <Input id="end_time" type="time" name="end_time" required disabled={loading} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>Criar Escala</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CreateRoleForm({
  scheduleId,
  members,
  onSuccess
}: {
  scheduleId: string,
  members: any[],
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('schedule_id', scheduleId)
    const result = await assignRole(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      ; (e.target as HTMLFormElement).reset()
      if (onSuccess) onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Nova Função</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input name="role_name" placeholder="Ex: Bateria" required disabled={loading} className="flex-1 h-9 text-xs bg-secondary/50 border-none" />
        <select name="member_id" className="flex-1 h-9 text-xs rounded-xl border-none bg-secondary/50 px-3" disabled={loading}>
          <option value="">Sem membro</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <button type="submit" disabled={loading} className="bg-primary/20 text-primary px-3 rounded-xl active-scale">
          <Plus className="w-4 h-4" />
        </button>
      </form>
      {error && <p className="text-destructive text-[10px] mt-1 font-bold">{error}</p>}
    </div>
  )
}

export function AddMemberToRoleForm({
  scheduleId,
  roleName,
  members,
  onSuccess
}: {
  scheduleId: string,
  roleName: string,
  members: any[],
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.append('schedule_id', scheduleId)
    if (roleName) formData.append('role_name', roleName)
    const result = await assignRole(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      ; (e.target as HTMLFormElement).reset()
      if (onSuccess) onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-1 items-center mt-1">
      <Input
        name="role_name"
        placeholder="Função (ex: Som)"
        defaultValue={roleName}
        className="h-7 text-[10px] bg-secondary/50 border-none w-24"
        required
      />
      <select name="member_id" className="h-7 text-[10px] rounded-lg border-none bg-secondary/50 px-2 flex-1" required disabled={loading}>
        <option value="">+ Membro</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <button type="submit" disabled={loading} className="bg-primary/10 text-primary p-1.5 rounded-lg active-scale">
        <Plus className="w-3 h-3" />
      </button>
      {error && <span className="text-destructive text-[9px] font-bold">{error}</span>}
    </form>
  )
}
