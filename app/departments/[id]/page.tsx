import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AddMemberForm, RemoveMemberButton } from './components/members-forms'

export default async function DepartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  const { data: department } = await supabase
    .from('departments')
    .select('*, leader:profiles!departments_leader_id_fkey(name)')
    .eq('id', id)
    .single()

  if (!department) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <h1 className="text-2xl font-bold text-destructive">Departamento não encontrado ou sem acesso</h1>
      </div>
    )
  }

  const isManager = profile?.role === 'church_manager';

  let usersToSelect: any[] = [];
  if (isManager) {
    const { data: users } = await supabase.from('profiles').select('id, name, role').eq('church_id', profile.church_id)
    usersToSelect = users || []
  }

  const { data: members } = await supabase
    .from('department_members')
    .select('*, profile:profiles(name, email)')
    .eq('department_id', id)

  return (
    <div className="min-h-screen bg-muted/10 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-card p-6 rounded-lg shadow-sm border space-y-2">
          <div className="flex justify-between items-start">
             <div>
               <h1 className="text-2xl font-bold text-primary">{department.name}</h1>
               <p className="text-muted-foreground text-sm">Líder atual: {department.leader?.name || 'Não definido'}</p>
             </div>
             <a href="/departments" className="text-sm font-semibold text-muted-foreground hover:underline">&larr; Voltar para Departamentos</a>
          </div>
        </header>

        <main className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Membros do Departamento</h2>
          
          {isManager && <AddMemberForm departmentId={id} users={usersToSelect} />}

          {(!members || members.length === 0) ? (
            <p className="text-muted-foreground">Nenhum membro cadastrado neste departamento.</p>
          ) : (
            <ul className="space-y-3">
              {members.map((member: any) => (
                <li key={member.id} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{member.profile?.name || member.profile?.email}</span>
                  {isManager && <RemoveMemberButton id={member.id} departmentId={id} />}
                </li>
              ))}
            </ul>
          )}
        </main>
        
        <main className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between border-b pb-2 mb-6">
             <h2 className="text-xl font-semibold">Escalas (Schedules)</h2>
             <a href={`/schedules?department_id=${id}`} className="text-sm font-semibold text-primary hover:underline">Ir para Escalas &rarr;</a>
          </div>
          <p className="text-muted-foreground text-sm">Gerenciamento de escalas é feito na aba global filtrada por departamento.</p>
        </main>
      </div>
    </div>
  )
}
