'use client'

import { useState } from 'react'
import { createDepartment } from '../actions'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Plus, Building2 } from 'lucide-react'

export function CreateDepartmentModal({ users, trigger }: { users: any[], trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await createDepartment(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Departamento
        </Button>
      )} />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Departamento</DialogTitle>
            <DialogDescription>
              Adicione um novo ministério ou área de serviço à igreja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">Nome</Label>
              <Input id="name" name="name" placeholder="Ex: Louvor, Infantil..." className="col-span-3" required disabled={loading} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leader_id" className="text-right text-xs">Líder</Label>
              <div className="col-span-3">
                <Select name="leader_id" disabled={loading}>
                  <SelectTrigger><SelectValue placeholder="Selecione um líder (opcional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Sem líder --</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>Criar Departamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
