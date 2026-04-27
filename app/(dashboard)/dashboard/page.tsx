import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { StatCard, SectionHeader, Badge, Avatar } from '@/components/ui-redesign'
import { Calendar, Users, Building2, Sparkles, ChevronRight, Plus, UserPlus, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const firstName = profile?.name?.split(' ')[0] || 'Usuário'

  return (
    <div className="space-y-6 fade-in">
      {/* Greeting */}
      <div className="px-1">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Segunda-feira, 27 de Abril</p>
        <h1 className="text-3xl font-black tracking-tight">Olá, {firstName} 👋</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta ao seu painel.</p>
      </div>

      {/* Next Scale Highlight Card */}
      <div className="relative overflow-hidden rounded-3xl indigo-gradient p-6 text-white shadow-lg shadow-indigo-500/20 active-scale">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Calendar className="w-24 h-24 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Próxima Escala
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">Culto da família</h2>
          <p className="text-white/80 text-sm mb-6">Domingo, 26 de abril • 18:30</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">Sua Função</p>
              <p className="font-bold">Serviço de cântico</p>
            </div>
            <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-white/30 transition-colors">
              Ver detalhes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Membros" value="124" icon={<Users className="w-5 h-5" />} />
        <StatCard label="Departamentos" value="8" icon={<Building2 className="w-5 h-5" />} />
        <StatCard label="Escalas do mês" value="12" icon={<Calendar className="w-5 h-5" />} />
        <StatCard label="Próximas (7d)" value="3" icon={<Sparkles className="w-5 h-5" />} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        <button className="flex-none bg-secondary/50 border border-border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active-scale">
          <Plus className="w-4 h-4 text-primary" /> Nova escala
        </button>
        <button className="flex-none bg-secondary/50 border border-border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active-scale">
          <UserPlus className="w-4 h-4 text-primary" /> Adicionar membro
        </button>
        <button className="flex-none bg-secondary/50 border border-border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active-scale">
          <LayoutGrid className="w-4 h-4 text-primary" /> Novo depto
        </button>
      </div>

      {/* Upcoming Events */}
      <div>
        <SectionHeader title="Próximos eventos">
          <Link href="/schedules" className="text-xs font-bold text-primary">Ver tudo</Link>
        </SectionHeader>
        
        <div className="space-y-3">
          {[
            { title: 'Culto da família', date: '26', month: 'ABR', time: '18:30 — 20:45', role: 'Cantor' },
            { title: 'Ensaio de louvor', date: '29', month: 'ABR', time: '19:30 — 21:00', role: 'Apoio' },
            { title: 'Culto de domingo', date: '03', month: 'MAI', time: '18:30 — 20:00', role: 'Líder' },
          ].map((event, i) => (
            <div key={i} className="glass p-3 rounded-2xl border flex items-center gap-4 active-scale shadow-xs">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl indigo-gradient text-white shadow-sm shadow-indigo-500/20">
                <span className="text-[10px] font-black uppercase leading-none">{event.month}</span>
                <span className="text-lg font-black leading-none">{event.date}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold truncate">{event.title}</h3>
                <p className="text-[11px] text-muted-foreground">{event.time}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] py-0">{event.role}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
