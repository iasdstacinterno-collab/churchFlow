'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProfile } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function CreateUserModal({ isGlobalAdmin, churchId }: { isGlobalAdmin: boolean, churchId: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    if (!formData.get('church_id')) formData.append('church_id', churchId)
    const result = await createProfile(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="church_id" value={churchId} />
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Adicione um novo membro ou líder para a igreja ativa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Senha Temp.</Label>
              <Input id="password" name="password" type="password" className="col-span-3" required minLength={6} placeholder="Ao menos 6 char"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Cargo</Label>
              <div className="col-span-3">
                <Select name="role" defaultValue="department_leader">
                  <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department_leader">Líder de Departamento</SelectItem>
                    {isGlobalAdmin && <SelectItem value="church_manager">Administrador da Igreja</SelectItem>}
                    {isGlobalAdmin && <SelectItem value="global_admin">Global Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
