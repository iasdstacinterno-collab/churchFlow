'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { removeRole } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Trash2 } from 'lucide-react'

export function DeleteAssignmentModal({ id, roleName }: { id: string, roleName: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await removeRole(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive text-destructive h-7 w-7 cursor-pointer">
        <Trash2 className="w-3 h-3" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={id} />
          <DialogHeader>
            <DialogTitle>Remover Voluntário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta atribuição da função <strong>{roleName}</strong> nesta escala?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="destructive">Remover</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
