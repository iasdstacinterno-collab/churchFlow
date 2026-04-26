import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { CreateMemberModal, EditMemberModal, DeleteMemberModal } from './components/member-modals'

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  let activeChurchId = profile?.church_id
  if (profile?.role === 'global_admin') {
    const cookieStore = await cookies()
    activeChurchId = cookieStore.get('active_church_id')?.value
  }

  if (!activeChurchId) {
    return (
      <div className="flex h-full items-center justify-center p-6 bg-card text-center text-muted-foreground rounded-lg border shadow-sm">
        <p>Selecione uma igreja no topo para gerenciar membros.</p>
      </div>
    )
  }

  const canManageMembers = profile?.role === 'global_admin' || profile?.role === 'church_manager' || profile?.role === 'department_leader'

  if (!canManageMembers) {
    return (
      <div className="flex h-full items-center justify-center p-6 bg-card text-center text-muted-foreground rounded-lg border shadow-sm">
        <p>Acesso restrito. Apenas gerentes e líderes podem gerenciar membros.</p>
      </div>
    )
  }

  const { data: members } = await supabase.from('members').select('*').eq('church_id', activeChurchId).order('name')

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex justify-between items-center bg-card p-6 rounded-xl shadow-xs border">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-primary">Membros</h1>
           <p className="text-sm text-muted-foreground mt-1">Gerencie a base de dados de membros para as escalas da igreja.</p>
        </div>
        <CreateMemberModal />
      </header>

      <main className="bg-card p-6 rounded-xl shadow-xs border">
        {(!members || members.length === 0) ? (
          <p className="text-muted-foreground text-center">Nenhum membro cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Nome</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member: any) => (
                  <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{member.name}</td>
                    <td className="px-4 py-3">{member.whatsapp || '-'}</td>
                    <td className="px-4 py-3">{member.email || '-'}</td>
                    <td className="px-4 py-3 text-right">
                       <div className="flex gap-2 justify-end">
                          <EditMemberModal member={member} />
                          <DeleteMemberModal id={member.id} name={member.name} />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
