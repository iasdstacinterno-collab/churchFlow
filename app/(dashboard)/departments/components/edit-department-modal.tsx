'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateDepartment } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit2 } from 'lucide-react'

export function EditDepartmentModal({ id, currentName, currentLeaderId, users }: { id: string, currentName: string, currentLeaderId: string | null, users: any[] }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    const result = await updateDepartment(formData)
    if (result?.error) setError(result.error)
    else setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10"><Edit2 className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={id} />
          <DialogHeader>
            <DialogTitle>Editar Departamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" name="name" defaultValue={currentName} className="col-span-3" required />
            </div>
            {users && users.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leader_id" className="text-right">Líder</Label>
                <div className="col-span-3">
                  <Select name="leader_id" defaultValue={currentLeaderId || ""}>
                    <SelectTrigger><SelectValue placeholder="Selecione um líder (opcional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Sem líder --</SelectItem>
                      {users.map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
