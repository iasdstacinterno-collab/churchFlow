import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Badge, Avatar, SectionHeader } from '@/components/ui-redesign'
import { Calendar, CheckCircle2, Shield, Mail, Copy, ExternalLink, LogOut, Bell, Globe } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'
import { SyncCalendarHandler } from './components/sync-calendar-handler'

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ syncing?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

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
    <div className="space-y-6 fade-in">
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm">Gerencie suas configurações e integrações.</p>
      </header>

      {/* Profile Header Card */}
      <div className="rounded-3xl indigo-gradient p-6 text-white shadow-lg shadow-indigo-500/20 active-scale relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield className="w-24 h-24 rotate-12" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <Avatar fallback={profile?.name || user.email || '?'} className="h-20 w-20 border-4 border-white/20 shadow-xl" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black truncate">{profile?.name || 'Usuário'}</h2>
            <p className="text-white/70 text-xs truncate mb-2">{user.email}</p>
            <Badge className="bg-white/20 text-white border-transparent text-[10px] font-black uppercase tracking-wider">
              <Shield className="w-3 h-3 mr-1" /> {profile?.role || 'Membro'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div>
        <SectionHeader title="Informações" />
        <div className="glass rounded-3xl border divide-y divide-border/50 overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between active-scale">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-xl">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</p>
                <p className="text-sm font-bold">{user.email}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="p-4 flex items-center justify-between active-scale">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-xl">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID do Sistema</p>
                <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[180px]">{user.id}</p>
              </div>
            </div>
            <Copy className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div>
        <SectionHeader title="Integrações de Conta" />
        <div className="space-y-3">
          {/* Google Calendar */}
          <div className="glass p-4 rounded-3xl border flex items-center gap-4 active-scale shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Google Calendar</h3>
              <p className="text-[10px] text-muted-foreground">Sincronize escalas com sua agenda</p>
            </div>
            {isConnected ? (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Conectado</Badge>
            ) : (
              <button className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black">Conectar</button>
            )}
          </div>

          {/* Notifications */}
          <div className="glass p-4 rounded-3xl border flex items-center gap-4 active-scale shadow-sm opacity-50">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Notificações</h3>
              <p className="text-[10px] text-muted-foreground">Lembretes de escalas e eventos</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">Em breve</Badge>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-4 px-1">
        <div className="active-scale">
          <LogoutButton />
        </div>
      </div>

      <SyncCalendarHandler isSyncing={isSyncing} />
    </div>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}
