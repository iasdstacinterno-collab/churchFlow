import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge, Avatar, SectionHeader, FAB } from '@/components/ui-redesign'
import { Building2, Users, Music, Heart, Utensils, Baby, GraduationCap, ChevronRight, Plus } from 'lucide-react'
import { cookies } from 'next/headers'

export default async function DepartmentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()
  
  const cookieStore = await cookies()
  const activeChurchId = profile?.role === 'global_admin' 
    ? cookieStore.get('active_church_id')?.value 
    : profile?.church_id

  const { data: departments } = await supabase.from('departments').select('*, leader:profiles(name)').eq('church_id', activeChurchId || '')

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

  return (
    <div className="space-y-6 fade-in">
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight">Departamentos</h1>
        <p className="text-muted-foreground text-sm">Gerencie os departamentos da igreja.</p>
      </header>

      {/* Primary Action Button */}
      <button className="w-full indigo-gradient text-white py-4 rounded-3xl font-black text-sm shadow-lg shadow-indigo-500/20 active-scale flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" /> Novo Departamento
      </button>

      {/* Departments List */}
      <div className="space-y-4">
        {(!departments || departments.length === 0) ? (
          <div className="text-center py-12 glass rounded-3xl border border-dashed">
            <p className="text-muted-foreground">Nenhum departamento encontrado.</p>
          </div>
        ) : (
          departments.map((dept: any) => (
            <Link key={dept.id} href={`/departments/${dept.id}`} className="block active-scale">
              <div className={cn("glass p-5 rounded-3xl border flex items-center gap-4 shadow-sm", "border-l-4 " + getCardColor(dept.name).split(' ').pop())}>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", getCardColor(dept.name).split(' ').slice(0,2).join(' '))}>
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
          ))
        )}
      </div>

      <FAB />
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
