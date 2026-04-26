import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateDepartmentForm } from './components/create-department-form'

export default async function DepartmentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  if (profile?.role !== 'church_manager' && profile?.role !== 'department_leader') {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <h1 className="text-2xl font-bold text-destructive">Acesso negado</h1>
      </div>
    )
  }

  let query = supabase.from('departments').select('*, leader:profiles(name)')
  if (profile.role === 'department_leader') {
      query = query.eq('leader_id', user.id)
  }

  const { data: departments } = await query

  let users: any[] = []
  if (profile.role === 'church_manager') {
      const { data } = await supabase.from('profiles').select('id, name, role').eq('church_id', profile.church_id)
      users = data || []
  }

  return (
    <div className="min-h-screen bg-muted/10 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold text-primary">Departamentos</h1>
          {profile.role === 'church_manager' && (
            <CreateDepartmentForm users={users} />
          )}
        </header>

        <main className="bg-card p-6 rounded-lg shadow-sm border">
          {departments?.length === 0 ? (
            <p className="text-muted-foreground text-center">Nenhum departamento encontrado.</p>
          ) : (
            <ul className="space-y-3">
              {departments?.map((dept: any) => (
                <li key={dept.id} className="flex justify-between items-center p-3 border rounded hover:border-primary transition-colors">
                  <span className="font-medium flex items-center gap-3">
                     {dept.name} 
                     {profile.role === 'church_manager' && (
                       <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">Líder: {dept.leader?.name || 'Não definido'}</span>
                     )}
                  </span>
                  <a href={`/departments/${dept.id}`} className="text-sm font-semibold text-primary hover:underline">Ver membros e escalas &rarr;</a>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}
