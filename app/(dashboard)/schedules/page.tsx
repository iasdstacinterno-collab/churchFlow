'use client'

import { Badge, Avatar, SectionHeader, FAB } from '@/app/components/ui-redesign'
import { Calendar, Users, MoreVertical, Clock, Plus } from 'lucide-react'
import { useSchedules } from '@/app/hooks/useSchedules'
import { useMembers } from '@/app/hooks/useMembers'
import { useDepartments } from '@/app/hooks/useDepartments'
import { useChurch } from '@/app/components/church-context'
import { cn } from '@/app/lib/utils'
import { useState, useMemo } from 'react'
import { CreateScheduleModal, CreateRoleForm, AddMemberToRoleForm } from './components/schedule-forms'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function SchedulesPage() {
  const { schedules, loading: schedulesLoading, refetch: refetchSchedules } = useSchedules()
  const { members, loading: membersLoading } = useMembers()
  const { departments, loading: deptsLoading } = useDepartments()
  const { currentChurchId } = useChurch()

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('Todas')

  const filters = ['Todas', 'Esta semana', 'Próximas', 'Minhas']

  const filteredSchedules = useMemo(() => {
    let list = schedules
    if (selectedDeptId) {
      list = list.filter(s => s.department_id === selectedDeptId)
    }
    // Add more filter logic here if needed for 'Esta semana', etc.
    return list
  }, [schedules, selectedDeptId, activeFilter])

  const currentDepts = departments || []

  if (schedulesLoading || deptsLoading || membersLoading) {
    return (
      <div className="space-y-6 fade-in pb-24">
        <div className="h-8 w-48 bg-secondary rounded-lg animate-pulse" />
        <div className="h-10 w-full bg-secondary rounded-full animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 w-full bg-secondary rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in pb-24">
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight">Escalas</h1>
        <p className="text-muted-foreground text-sm">Organize cultos, ensaios e eventos.</p>
      </header>

      {/* Department Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
        <button
          onClick={() => setSelectedDeptId(null)}
          className={cn(
            "flex-none px-5 py-2 rounded-full text-xs font-bold transition-all active-scale",
            selectedDeptId === null ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground border border-border"
          )}
        >
          Todos Deptos
        </button>
        {currentDepts.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            className={cn(
              "flex-none px-5 py-2 rounded-full text-xs font-bold transition-all active-scale",
              selectedDeptId === dept.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground border border-border"
            )}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {(!filteredSchedules || filteredSchedules.length === 0) ? (
          <div className="glass p-8 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-muted rounded-2xl">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Nenhuma escala</h3>
              <p className="text-xs text-muted-foreground">Não há eventos agendados para este critério.</p>
            </div>
            {selectedDeptId && (
              <CreateScheduleModal departmentId={selectedDeptId} onSuccess={refetchSchedules} trigger={
                <button className="text-primary text-xs font-bold mt-2">+ Criar primeira escala</button>
              } />
            )}
          </div>
        ) : (
          filteredSchedules.map((schedule: any) => {
            const date = new Date(schedule.date + 'T12:00:00') // Avoid timezone shift

            return (
              <div key={schedule.id} className="glass rounded-3xl border p-5 space-y-4 active-scale shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-2xl indigo-gradient text-white shadow-lg shadow-indigo-500/20">
                      <span className="text-[10px] font-black uppercase leading-none opacity-80">
                        {format(date, "MMM", { locale: ptBR })}
                      </span>
                      <span className="text-xl font-black leading-none">
                        {format(date, "dd")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{schedule.event_type}</h3>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {schedule.start_time.substring(0, 5)} às {schedule.end_time.substring(0, 5)}
                        </div>
                        <Badge variant="indigo" className="text-[9px] px-2 py-0">
                          {schedule.department?.name || 'Evento'}
                        </Badge>
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

                  <div className="space-y-3">
                    {/* Group by role_name if needed, but here we just list */}
                    {schedule.assignments?.map((assignment: any) => (
                      <div key={assignment.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar fallback={assignment.member?.name || '?'} className="h-7 w-7 border-none" />
                          <div>
                            <p className="text-xs font-bold">{assignment.member?.name || 'Vago'}</p>
                            <p className="text-[10px] text-muted-foreground">{assignment.role_name || 'Sem função'}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Form to add more members to this schedule */}
                    <AddMemberToRoleForm
                      scheduleId={schedule.id}
                      roleName=""
                      members={members}
                      onSuccess={refetchSchedules}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {selectedDeptId && (
        <CreateScheduleModal departmentId={selectedDeptId} onSuccess={refetchSchedules} trigger={
          <FAB>
            <Plus className="h-6 w-6" />
          </FAB>
        } />
      )}
    </div>
  )
}
