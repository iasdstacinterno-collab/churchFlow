'use client'

import Link from 'next/link'
import { Badge, Avatar, FAB } from '@/app/components/ui-redesign'
import { Building2, Music, Heart, Utensils, Baby, GraduationCap, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react'
import { CreateDepartmentModal } from './components/create-department-modal'
import { EditDepartmentModal } from './components/edit-department-modal'
import { DeleteDepartmentModal } from './components/delete-department-modal'
import { useDepartments } from '@/app/hooks/useDepartments'
import { useChurch } from '@/app/components/church-context'
import { cn } from '@/app/lib/utils'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'

export default function DepartmentsPage() {
  const { departments, loading, refetch } = useDepartments()
  const { currentChurchId } = useChurch()
  const [users, setUsers] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchUsers() {
      if (!currentChurchId) return
      const { data } = await supabase.from('profiles').select('id, name, email').eq('church_id', currentChurchId)
      setUsers(data || [])
    }
    fetchUsers()
  }, [currentChurchId, supabase])

  const getIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('louvor') || n.includes('som') || n.includes('música')) return <Music className="w-5 h-5" />
    if (n.includes('recepção') || n.includes('acolhimento')) return <Heart className="w-5 h-5" />
    if (n.includes('infantil') || n.includes('crianças')) return <Baby className="w-5 h-5" />
    if (n.includes('ensino') || n.includes('escola')) return <GraduationCap className="w-5 h-5" />
    if (n.includes('social') || n.includes('alimento')) return <Utensils className="w-5 h-5" />
    return <Building2 className="w-5 h-5" />
  }

  const getCardColor = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('louvor')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    if (n.includes('recepção')) return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    if (n.includes('som')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    if (n.includes('infantil')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    return 'bg-primary/10 text-primary border-primary/20'
  }

  if (loading) {
    return (
      <div className="space-y-6 fade-in pb-24">
        <div className="h-8 w-48 bg-secondary rounded-lg animate-pulse" />
        <div className="h-16 w-full bg-secondary rounded-3xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 w-full bg-secondary rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in pb-24">
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight">Departamentos</h1>
        <p className="text-muted-foreground text-sm">Gerencie os departamentos da igreja.</p>
      </header>

      {/* Primary Action Button */}
      <CreateDepartmentModal users={users} onSuccess={refetch} trigger={
        <button className="w-full indigo-gradient text-white py-4 rounded-3xl font-black text-sm shadow-lg shadow-indigo-500/20 active-scale flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Novo Departamento
        </button>
      } />

      {/* Departments List */}
      <div className="space-y-4">
        {(!departments || departments.length === 0) ? (
          <div className="text-center py-12 glass rounded-3xl border border-dashed">
            <p className="text-muted-foreground">Nenhum departamento encontrado.</p>
          </div>
        ) : (
          departments.map((dept: any) => (
            <div key={dept.id} className="relative group active-scale">
              <Link href={`/departments/${dept.id}`} className="block">
                <div className={cn("glass p-5 rounded-3xl border flex items-center gap-4 shadow-sm", "border-l-4 " + getCardColor(dept.name).split(' ').pop().replace('border-', ''))}>
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", getCardColor(dept.name).split(' ').slice(0, 2).join(' '))}>
                    {getIcon(dept.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight">{dept.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar fallback={dept.leader?.name || '?'} className="h-5 w-5 border-none" />
                      <p className="text-xs text-muted-foreground truncate">
                        Líder: <span className="text-foreground font-medium">{dept.leader?.name || 'Não definido'}</span>
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>

              {/* Quick Actions overlaying the card or next to it */}
              <div className="absolute top-4 right-12 flex gap-1">
                <EditDepartmentModal id={dept.id} currentName={dept.name} currentLeaderId={dept.leader_id} users={users} onSuccess={refetch} trigger={
                  <button className="p-2 text-muted-foreground/50 hover:text-primary transition-colors bg-secondary/50 rounded-lg backdrop-blur-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>
                } />
                <DeleteDepartmentModal id={dept.id} name={dept.name} onSuccess={refetch} trigger={
                  <button className="p-2 text-muted-foreground/50 hover:text-destructive transition-colors bg-secondary/50 rounded-lg backdrop-blur-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                } />
              </div>
            </div>
          ))
        )}
      </div>

      <CreateDepartmentModal users={users} onSuccess={refetch} trigger={
        <FAB>
          <Plus className="h-6 w-6" />
        </FAB>
      } />
    </div>
  )
}
