'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { deleteSchedule } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

export function DeleteScheduleModal({ id, event_type }: { id: string, event_type: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await deleteSchedule(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive text-destructive h-9 w-9 cursor-pointer">
        <Trash2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={id} />
          <DialogHeader>
            <DialogTitle>Excluir Escala</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a escala de <strong>{event_type}</strong>? Todas as funções atreladas serão perdidas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
             <Button type="submit" variant="destructive">Confirmar Exclusão</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
