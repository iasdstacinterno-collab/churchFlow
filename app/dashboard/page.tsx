import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-muted/10 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-primary">ChurchFlow</h1>
            <p className="text-muted-foreground mt-1">Bem-vindo, {profile?.name || user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
             <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary uppercase">
               {profile?.role || 'Sem acesso'}
             </span>
             <LogoutButton />
          </div>
        </header>

        <main className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Painel de Controle</h2>
          <p className="text-sm text-muted-foreground">
             Este é o seu dashboard do MVP. Suas funcionalidades de igreja e escalas aparecerão aqui conforme as permissões.
          </p>
        </main>
      </div>
    </div>
  )
}
