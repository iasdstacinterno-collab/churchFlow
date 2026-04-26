'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateSchedule } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit2 } from 'lucide-react'

export function EditScheduleModal({ schedule }: { schedule: any }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await updateSchedule(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/10 text-primary h-9 w-9 cursor-pointer">
        <Edit2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={schedule.id} />
          <DialogHeader>
            <DialogTitle>Editar Escala</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event_type" className="text-right text-xs">Tipo de Evento</Label>
              <Input id="event_type" name="event_type" defaultValue={schedule.event_type} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-xs">Data</Label>
              <Input id="date" name="date" type="date" defaultValue={schedule.date} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_time" className="text-right text-xs">Início</Label>
              <Input id="start_time" name="start_time" type="time" defaultValue={schedule.start_time} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end_time" className="text-right text-xs">Fim</Label>
              <Input id="end_time" name="end_time" type="time" defaultValue={schedule.end_time} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
