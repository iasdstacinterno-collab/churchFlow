'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { deleteChurch } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Trash2 } from 'lucide-react'

export function DeleteChurchModal({ id, name }: { id: string, name: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await deleteChurch(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={id} />
          <DialogHeader>
            <DialogTitle>Excluir Igreja</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{name}</strong>? Se houver departamentos, membros ou registros vinculados, a exclusão falhará por segurança.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded">{error}</p>}
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
