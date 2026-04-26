import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateDepartmentForm } from './components/create-department-form'
import { EditDepartmentModal } from './components/edit-department-modal'
import { DeleteDepartmentModal } from './components/delete-department-modal'
import { cookies } from 'next/headers'

export default async function DepartmentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  if (profile?.role !== 'church_manager' && profile?.role !== 'department_leader' && profile?.role !== 'global_admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <h1 className="text-2xl font-bold text-destructive">Acesso negado</h1>
      </div>
    )
  }

  let activeChurchId = profile?.church_id
  if (profile?.role === 'global_admin') {
    const cookieStore = await cookies()
    activeChurchId = cookieStore.get('active_church_id')?.value
  }

  let query = supabase.from('departments').select('*, leader:profiles(name)')
  if (activeChurchId) {
      query = query.eq('church_id', activeChurchId)
  }
  if (profile.role === 'department_leader') {
      // department_leader initially only sees their own assigned departments
      query = query.eq('leader_id', user.id)
  }
  const { data: departments } = await query

  let users: any[] = []
  if (activeChurchId) {
      const { data } = await supabase.from('profiles').select('id, name, role').eq('church_id', activeChurchId)
      users = data || []
  }

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex justify-between items-center bg-card p-6 rounded-xl shadow-xs border">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-primary">Departamentos</h1>
           <p className="text-sm text-muted-foreground mt-1">Gerencie os departamentos da igreja</p>
        </div>
        {(profile.role === 'church_manager' || profile.role === 'global_admin' || profile.role === 'department_leader') && (
          <CreateDepartmentForm users={users} />
        )}
      </header>

      <main className="bg-card p-6 rounded-xl shadow-xs border">
        {departments?.length === 0 ? (
          <p className="text-muted-foreground text-center">Nenhum departamento encontrado.</p>
        ) : (
          <ul className="space-y-3">
            {departments?.map((dept: any) => (
              <li key={dept.id} className="flex justify-between items-center p-3 border rounded hover:border-primary transition-colors">
                <span className="font-medium flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                   {dept.name} 
                   <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground w-fit">Líder: {dept.leader?.name || 'Não definido'}</span>
                </span>
                <div className="flex gap-2 items-center">
                  <a href={`/departments/${dept.id}`} className="text-sm font-semibold text-primary hover:underline px-3 hidden sm:block">Ver membros &rarr;</a>
                  {profile.role === 'church_manager' || profile.role === 'global_admin' ? (
                    <>
                      <EditDepartmentModal id={dept.id} currentName={dept.name} currentLeaderId={dept.leader_id} users={users || []} />
                      <DeleteDepartmentModal id={dept.id} name={dept.name} />
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
