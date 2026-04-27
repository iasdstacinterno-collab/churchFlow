import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Badge, Avatar, SectionHeader, FAB } from '@/components/ui-redesign'
import { Calendar, Users, MoreVertical, Clock } from 'lucide-react'
import { cookies } from 'next/headers'

export default async function SchedulesPage({ searchParams }: { searchParams: Promise<{ department_id?: string }> }) {
  const { department_id } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()
  
  const cookieStore = await cookies()
  const activeChurchId = profile?.role === 'global_admin' 
    ? cookieStore.get('active_church_id')?.value 
    : profile?.church_id

  // Fetch departments for filter chips
  let deptQuery = supabase.from('departments').select('id, name, leader_id')
  if (activeChurchId) deptQuery = deptQuery.eq('church_id', activeChurchId)
  const { data: departments } = await deptQuery

  const selectedDeptId = department_id || departments?.[0]?.id
  const canEdit = profile?.role === 'global_admin' || profile?.role === 'church_manager'

  // Load schedules
  const { data: schedules } = await supabase.from('schedules').select(`
    *,
    assignments:schedule_assignments(*, member:members(name))
  `).eq('department_id', selectedDeptId || '').order('date', { ascending: true })

  const filters = ['Todas', 'Esta semana', 'Próximas', 'Minhas']

  return (
    <div className="space-y-6 fade-in">
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight">Escalas</h1>
        <p className="text-muted-foreground text-sm">Organize cultos, ensaios e eventos.</p>
      </header>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
        {filters.map((filter, i) => (
          <button 
            key={filter} 
            className={cn(
              "flex-none px-5 py-2 rounded-full text-xs font-bold transition-all active-scale",
              i === 0 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground border border-border"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {(!schedules || schedules.length === 0) ? (
          <div className="glass p-8 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-muted rounded-2xl">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Nenhuma escala</h3>
              <p className="text-xs text-muted-foreground">Não há eventos agendados para este departamento.</p>
            </div>
          </div>
        ) : (
          schedules.map((schedule: any) => {
            const date = new Date(schedule.date)
            const day = date.getUTCDate()
            const month = date.toLocaleString('pt-BR', { month: 'short', timeZone: 'UTC' }).toUpperCase()
            
            return (
              <div key={schedule.id} className="glass rounded-3xl border p-5 space-y-4 active-scale shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-2xl indigo-gradient text-white shadow-lg shadow-indigo-500/20">
                      <span className="text-[10px] font-black uppercase leading-none opacity-80">{month}</span>
                      <span className="text-xl font-black leading-none">{day}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{schedule.event_type}</h3>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {schedule.start_time.substring(0,5)} às {schedule.end_time.substring(0,5)}
                        </div>
                        <Badge variant="indigo" className="text-[9px] px-2 py-0">Culto</Badge>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Voluntários e Funções</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                      <Users className="w-3 h-3" /> {schedule.assignments?.length || 0}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {schedule.assignments?.slice(0, 3).map((assignment: any) => (
                      <div key={assignment.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar fallback={assignment.member?.name || '?'} className="h-7 w-7 border-none" />
                          <div>
                            <p className="text-xs font-bold">{assignment.member?.name}</p>
                            <p className="text-[10px] text-muted-foreground">{assignment.role_name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {schedule.assignments?.length > 3 && (
                      <p className="text-[10px] text-primary font-bold pl-9">+ {schedule.assignments.length - 3} outros</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {canEdit && <FAB />}
    </div>
  )
}

// Utility for conditional classes (copy of what's likely in @/lib/utils)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
