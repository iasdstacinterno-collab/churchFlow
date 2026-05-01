'use client'

import { StatCard, SectionHeader, Badge, Avatar } from '@/app/components/ui-redesign'
import { Calendar, Users, Building2, Sparkles, ChevronRight, Plus, UserPlus, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { useMembers } from '@/app/hooks/useMembers'
import { useDepartments } from '@/app/hooks/useDepartments'
import { useSchedules } from '@/app/hooks/useSchedules'
import { useChurch } from '@/app/components/church-context'
import { format, isAfter, startOfDay, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@/app/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { members } = useMembers()
  const { departments } = useDepartments()
  const { schedules, loading: schedulesLoading } = useSchedules()
  const { currentChurchId } = useChurch()
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
    }
    getProfile()
  }, [supabase])

  const firstName = profile?.name?.split(' ')[0] || 'Usuário'
  const today = new Date()

  // Filter upcoming schedules
  const upcomingSchedules = schedules
    ?.filter(s => isAfter(new Date(s.date + 'T' + s.start_time), today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []

  const nextSchedule = upcomingSchedules[0]
  const weekSchedules = upcomingSchedules.filter(s => isAfter(new Date(s.date), addDays(today, 7)) === false)

  // Find user's role in next schedule
  const userAssignment = nextSchedule?.assignments?.find((a: any) => a.member?.id === profile?.id)

  return (
    <div className="space-y-6 fade-in">
      {/* Greeting */}
      <div className="px-1">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
          {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
        <h1 className="text-3xl font-black tracking-tight">Olá, {firstName} 👋</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta ao seu painel.</p>
      </div>

      {/* Next Scale Highlight Card */}
      {nextSchedule ? (
        <div className="relative overflow-hidden rounded-3xl indigo-gradient p-6 text-white shadow-lg shadow-indigo-500/20 active-scale">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Calendar className="w-24 h-24 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Próxima Escala
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{nextSchedule.event_type}</h2>
            <p className="text-white/80 text-sm mb-6">
              {format(new Date(nextSchedule.date), "EEEE, d 'de' MMMM", { locale: ptBR })} • {nextSchedule.start_time.substring(0, 5)}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">Sua Função</p>
                <p className="font-bold">{userAssignment?.role || 'Visitante'}</p>
              </div>
              <Link href={`/schedules/${nextSchedule.id}`} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-white/30 transition-colors">
                Ver detalhes <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : !schedulesLoading && (
        <div className="glass p-6 rounded-3xl border border-dashed text-center">
          <p className="text-muted-foreground text-sm font-medium">Nenhuma escala futura agendada.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Membros" value={members?.length.toString() || '0'} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Departamentos" value={departments?.length.toString() || '0'} icon={<Building2 className="w-5 h-5" />} />
        <StatCard label="Escalas" value={schedules?.length.toString() || '0'} icon={<Calendar className="w-5 h-5" />} />
        <StatCard label="Próximas (7d)" value={weekSchedules.length.toString()} icon={<Sparkles className="w-5 h-5" />} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        <Link href="/schedules" className="flex-none bg-secondary/50 border border-border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active-scale">
          <Plus className="w-4 h-4 text-primary" /> Nova escala
        </Link>
        <Link href="/members" className="flex-none bg-secondary/50 border border-border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active-scale">
          <UserPlus className="w-4 h-4 text-primary" /> Adicionar membro
        </Link>
        <Link href="/departments" className="flex-none bg-secondary/50 border border-border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active-scale">
          <LayoutGrid className="w-4 h-4 text-primary" /> Novo depto
        </Link>
      </div>

      {/* Upcoming Events */}
      <div>
        <SectionHeader title="Próximos eventos">
          <Link href="/schedules" className="text-xs font-bold text-primary">Ver tudo</Link>
        </SectionHeader>

        <div className="space-y-3">
          {upcomingSchedules.length === 0 ? (
            <p className="text-center py-6 text-xs text-muted-foreground">Sem eventos próximos.</p>
          ) : (
            upcomingSchedules.slice(0, 3).map((event, i) => {
              const eventDate = new Date(event.date)
              return (
                <div key={event.id} className="glass p-3 rounded-2xl border flex items-center gap-4 active-scale shadow-xs">
                  <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl indigo-gradient text-white shadow-sm shadow-indigo-500/20">
                    <span className="text-[10px] font-black uppercase leading-none">
                      {format(eventDate, "MMM", { locale: ptBR })}
                    </span>
                    <span className="text-lg font-black leading-none">
                      {format(eventDate, "dd")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold truncate">{event.event_type}</h3>
                    <p className="text-[11px] text-muted-foreground">{event.start_time.substring(0, 5)} — {event.end_time.substring(0, 5)}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] py-0">
                    {event.department?.name || 'Evento'}
                  </Badge>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
