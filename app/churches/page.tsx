import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateChurchForm } from './components/create-church-form'

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
    <div className="min-h-screen bg-muted/10 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold text-primary">Gerenciar Igrejas</h1>
          <CreateChurchForm />
        </header>

        <main className="bg-card p-6 rounded-lg shadow-sm border">
          {churches?.length === 0 ? (
            <p className="text-muted-foreground text-center">Nenhuma igreja cadastrada.</p>
          ) : (
            <ul className="space-y-3">
              {churches?.map((church: any) => (
                <li key={church.id} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{church.name}</span>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}
