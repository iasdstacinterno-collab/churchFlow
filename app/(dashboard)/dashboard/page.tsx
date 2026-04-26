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
    <div className="max-w-4xl space-y-6">
      <header className="flex justify-between items-center bg-card p-6 rounded-xl shadow-xs border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Meu Resumo</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo ao dashboard inicial, {profile?.name || user.email}</p>
        </div>
      </header>

      <main className="bg-card p-6 rounded-xl shadow-xs border">
        <h2 className="text-lg font-medium mb-4">Painel de Controle</h2>
        <p className="text-sm text-muted-foreground">
           Este é o seu dashboard do MVP. Suas funcionalidades de igreja e escalas aparecerão no menu esquerdo conforme as permissões.
        </p>
      </main>
    </div>
  )
}
