import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { CreateUserModal } from './components/create-user-modal'
import { DeleteUserModal } from './components/delete-user-modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role === 'department_leader') {
    return <div className="p-8 text-center text-muted-foreground bg-card border rounded-lg">Acesso negado. Apenas managers e admins.</div>
  }

  const isGlobalAdmin = profile?.role === 'global_admin'
  let activeChurchId = profile?.church_id

  if (isGlobalAdmin) {
    const cookieStore = await cookies()
    activeChurchId = cookieStore.get('active_church_id')?.value
  }

  // Se global admin não escolheu igreja e a page carregou (edge case), mostre vazio
  let usersList = []
  if (activeChurchId || (!activeChurchId && isGlobalAdmin)) {
    let query = supabase.from('profiles').select('*').order('name')
    if (activeChurchId) {
      query = query.eq('church_id', activeChurchId)
    }
    const { data } = await query
    usersList = data || []
  }

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex justify-between items-center bg-card p-6 rounded-xl shadow-xs border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Usuários</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie lideranças e managers.</p>
        </div>
        {activeChurchId && (
          <CreateUserModal isGlobalAdmin={isGlobalAdmin} churchId={activeChurchId} />
        )}
      </header>

      <main className="bg-card rounded-xl shadow-xs border overflow-hidden">
        {usersList.length === 0 ? (
          <p className="text-muted-foreground text-center p-6">Nenhum usuário cadastrado.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersList.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name || 'Sem nome'}</TableCell>
                  <TableCell>
                    <span className="bg-muted px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">{u.role}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {(isGlobalAdmin || profile.role === 'church_manager') && u.id !== user.id && (
                      <DeleteUserModal id={u.id} name={u.name} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  )
}
