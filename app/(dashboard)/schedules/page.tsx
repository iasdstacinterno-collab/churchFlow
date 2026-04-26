import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateScheduleForm, CreateRoleForm, AddMemberToRoleForm } from './components/schedule-forms'
import { EditScheduleModal } from './components/edit-schedule-modal'
import { DeleteScheduleModal } from './components/delete-schedule-modal'
import { DeleteAssignmentModal } from './components/delete-assignment-modal'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'

export default async function SchedulesPage({ searchParams }: { searchParams: Promise<{ department_id?: string }> }) {
  const { department_id } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  let activeChurchId = profile?.church_id
  if (profile?.role === 'global_admin') {
    const cookieStore = await cookies()
    activeChurchId = cookieStore.get('active_church_id')?.value
  }

  // Find all departments user can view to populate the selector
  let deptQuery = supabase.from('departments').select('id, name, leader_id')
  if (activeChurchId) {
      deptQuery = deptQuery.eq('church_id', activeChurchId)
  }
  if (profile?.role === 'department_leader') {
      deptQuery = deptQuery.eq('leader_id', user.id)
  }
  const { data: departments } = await deptQuery

  if (!departments || departments.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
         <p className="text-muted-foreground">Nenhum departamento encontrado. Você não gerencia nem pertence a nenhum com escalas ativas.</p>
      </div>
    )
  }

  const selectedDeptId = department_id || departments[0].id
  const selectedDept = departments.find((d: any) => d.id === selectedDeptId) || departments[0];

  const amILeader = selectedDept.leader_id === user.id || profile?.role === 'global_admin' || profile?.role === 'church_manager'; // RLS will strict limit leader but manager can't edit unless specified by RLS. Prompt says "Apenas líder do departamento pode editar". RLS allows manager? Oh wait, RLS for schedules was 'global_admin' and 'leader_all'. So manager cannot edit! amILeader should track RLS.
  // We'll just define amILeader solely for UI visibility, RLS actually rejects manager if they try to edit unless they are the leader or admin.
  const canEdit = selectedDept.leader_id === user.id || profile?.role === 'global_admin';

  // Load schedules
  const { data: schedules } = await supabase.from('schedules').select(`
    *,
    assignments:schedule_assignments(*, member:members(name))
  `).eq('department_id', selectedDeptId).order('date', { ascending: true })

  // Members for dropdown
  const { data: members } = await supabase.from('department_members').select('member_id, member:members(name)').eq('department_id', selectedDeptId)

  return (
    <div className="max-w-6xl space-y-6">
      <header className="bg-card p-6 rounded-xl shadow-xs border space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Escalas (Schedules)</h1>
        {/* Dept selector */}
        <div className="flex gap-2">
          {departments.map((d: any) => (
            <a key={d.id} href={`/schedules?department_id=${d.id}`}>
             <Button variant={d.id === selectedDeptId ? 'default' : 'outline'} size="sm">{d.name}</Button>
            </a>
          ))}
        </div>
      </header>

      <main className="space-y-6">
        {canEdit && (
          <div className="bg-card p-6 rounded-xl shadow-xs border">
            <CreateScheduleForm departmentId={selectedDeptId} />
          </div>
        )}

        {(!schedules || schedules.length === 0) ? (
          <p className="text-muted-foreground bg-card p-6 rounded-lg shadow-sm border text-center">Nenhuma escala cadastrada no momento para {selectedDept.name}.</p>
        ) : (
          schedules.map((schedule: any) => (
            <div key={schedule.id} className="bg-card p-6 rounded-xl shadow-xs border">
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{schedule.event_type}</h3>
                  <p className="text-muted-foreground text-sm">
                     {new Date(schedule.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} das {schedule.start_time.substring(0,5)} às {schedule.end_time.substring(0,5)}
                  </p>
                </div>
                {canEdit && (
                   <div className="flex gap-2">
                      <EditScheduleModal schedule={schedule} />
                      <DeleteScheduleModal id={schedule.id} event_type={schedule.event_type} />
                   </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Voluntários e Funções</h4>
                {(!schedule.assignments || schedule.assignments.length === 0) ? (
                  <p className="text-xs text-muted-foreground italic mb-2">Sem funções atribuídas.</p>
                ) : (
                  (() => {
                    const rolesGrouped = schedule.assignments.reduce((acc: any, curr: any) => {
                      if (!acc[curr.role_name]) acc[curr.role_name] = [];
                      acc[curr.role_name].push(curr);
                      return acc;
                    }, {});
                    return (
                      <div className="mb-4 space-y-3">
                         {Object.keys(rolesGrouped).map((roleName) => (
                            <div key={roleName} className="mb-3 px-3 py-2 bg-muted/30 rounded border">
                               <div className="flex justify-between items-center mb-2 pb-1 border-b">
                                  <h5 className="font-semibold text-primary text-sm">{roleName}</h5>
                                  {canEdit && members && <AddMemberToRoleForm scheduleId={schedule.id} roleName={roleName} members={members} />}
                               </div>
                               <ul className="space-y-1">
                                  {rolesGrouped[roleName].map((assignment: any) => (
                                     <li key={assignment.id} className="flex justify-between items-center text-xs pl-2 border-l-2 border-primary/20">
                                        <span>{assignment.member?.name || 'Vaga em aberto'}</span>
                                        {canEdit && <DeleteAssignmentModal id={assignment.id} roleName={assignment.role_name} />}
                                     </li>
                                  ))}
                               </ul>
                            </div>
                         ))}
                      </div>
                    )
                  })()
                )}
                {canEdit && members && <CreateRoleForm scheduleId={schedule.id} members={members} />}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
