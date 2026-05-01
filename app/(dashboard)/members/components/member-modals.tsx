'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { createMember, updateMember, deleteMember } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Trash2, Edit2, UserPlus } from 'lucide-react'

export function CreateMemberModal({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await createMember(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <Button variant="default" className="gap-2">
          <UserPlus className="w-4 h-4" /> Novo Membro
        </Button>
      )} />
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

export function EditMemberModal({ member, trigger }: { member: any, trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await updateMember(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <Button variant="ghost" size="icon" className="text-primary">
          <Edit2 className="w-4 h-4" />
        </Button>
      )} />
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

export function DeleteMemberModal({ id, name, trigger }: { id: string, name: string, trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await deleteMember(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      )} />
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
