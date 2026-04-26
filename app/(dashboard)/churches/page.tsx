import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateChurchForm } from './components/create-church-form'
import { EditChurchModal } from './components/edit-church-modal'
import { DeleteChurchModal } from './components/delete-church-modal'

export default async function ChurchesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'global_admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <h1 className="text-2xl font-bold text-destructive">Acesso negado</h1>
      </div>
    )
  }

  const { data: churches } = await supabase.from('churches').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex justify-between items-center bg-card p-6 rounded-xl shadow-xs border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Gerenciar Igrejas</h1>
          <p className="text-muted-foreground text-sm mt-1">Módulo restrito para Global Admins</p>
        </div>
        <CreateChurchForm />
      </header>

      <main className="bg-card p-6 rounded-xl shadow-xs border">
        {churches?.length === 0 ? (
          <p className="text-muted-foreground text-center">Nenhuma igreja cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {churches?.map((church: any) => (
              <li key={church.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/30 transition-colors">
                <span className="font-medium text-foreground">{church.name}</span>
                <div className="flex gap-2">
                   <EditChurchModal id={church.id} currentName={church.name} />
                   <DeleteChurchModal id={church.id} name={church.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
