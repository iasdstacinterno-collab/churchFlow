'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMember, updateMember, deleteMember } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Edit2, UserPlus } from 'lucide-react'

export function CreateMemberModal() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await createMember(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
        <UserPlus className="w-4 h-4" /> Novo Membro
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Membro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">Nome</Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-xs">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="Opcional" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp" className="text-right text-xs">WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" placeholder="Opcional" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Membro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EditMemberModal({ member }: { member: any }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await updateMember(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/10 text-primary h-10 w-10">
        <Edit2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={member.id} />
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">Nome</Label>
              <Input id="name" name="name" defaultValue={member.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-xs">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={member.email || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp" className="text-right text-xs">WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" defaultValue={member.whatsapp || ''} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Atualizar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteMemberModal({ id, name }: { id: string, name: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await deleteMember(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 text-destructive h-10 w-10">
        <Trash2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={id} />
          <DialogHeader>
            <DialogTitle>Excluir Membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{name}</strong>? Este membro será removido de todos os departamentos e escalas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
             <Button type="submit" variant="destructive">Confirmar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
