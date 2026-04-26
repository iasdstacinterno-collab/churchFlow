import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, Link2Off } from 'lucide-react'
import { disconnectGoogle } from './actions'
import { SyncCalendarHandler } from './components/sync-calendar-handler'

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ syncing?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check existing integrations
  const { data: integration } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', 'google')
    .single()

  const isConnected = !!integration
  const isSyncing = params.syncing === 'true'

  return (
    <div className="max-w-4xl space-y-6">
      <header className="bg-card p-6 rounded-xl shadow-sm border space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm">Gerencie suas configurações e integrações com aplicativos de terceiros.</p>
      </header>

      <main className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <div className="bg-card p-6 rounded-xl shadow-sm border h-min">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Informações</h2>
          <div className="space-y-4 text-sm mt-4">
             <div>
                <p className="text-muted-foreground text-xs">E-mail</p>
                <p className="font-medium text-foreground">{user.email}</p>
             </div>
             <div>
                <p className="text-muted-foreground text-xs">ID do Sistema</p>
                <p className="font-mono text-xs text-muted-foreground mt-1 truncate">{user.id}</p>
             </div>
          </div>
        </div>

        {/* Integrations Card */}
        <div className="bg-card p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Integrações de Conta</h2>
          
          <div className="mt-4 p-4 rounded-lg border bg-muted/20 flex flex-col items-center text-center space-y-4">
             <div className="bg-background p-3 rounded-full shadow-sm border">
               <Calendar className="w-6 h-6 text-primary" />
             </div>
             <div>
               <h3 className="font-medium">Google Calendar</h3>
               <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                 Permite que o ChurchFlow crie automaticamente eventos no seu calendário oficial sempre que você for escalado(a) para um departamento.
               </p>
             </div>

             <div className="w-full pt-4 border-t border-dashed mt-2 flex flex-col items-center">
                {isConnected ? (
                  <>
                     <div className="flex items-center text-emerald-600 font-medium text-sm mb-4 gap-2 bg-emerald-50 px-3 py-1.5 rounded-full dark:bg-emerald-950/30">
                        <CheckCircle2 className="w-4 h-4" /> Conectado e Sincronizando
                     </div>
                     <form action={disconnectGoogle}>
                        <Button type="submit" variant="destructive" size="sm" className="gap-2 w-full max-w-[200px]">
                           <Link2Off className="w-4 h-4" /> Desconectar
                        </Button>
                     </form>
                  </>
                ) : (
                  <form action="/auth/google-connect" method="POST" className="w-full flex justify-center">
                     <Button type="submit" className="gap-2 w-full max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white">
                        <Calendar className="w-4 h-4" /> Conectar Agora
                     </Button>
                  </form>
                )}
             </div>
          </div>

          <SyncCalendarHandler isSyncing={isSyncing} />
        </div>
      </main>
    </div>
  )
}
