import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Badge, Avatar, SectionHeader, FAB } from '@/components/ui-redesign'
import { Search, Edit2, Trash2, MoreVertical, Mail, Phone } from 'lucide-react'

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()
  
  const cookieStore = await cookies()
  const activeChurchId = profile?.role === 'global_admin' 
    ? cookieStore.get('active_church_id')?.value 
    : profile?.church_id

  const { data: members } = await supabase.from('members').select('*').eq('church_id', activeChurchId || '').order('name')

  return (
    <div className="space-y-6 fade-in">
      <header className="px-1 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Membros</h1>
          <p className="text-muted-foreground text-sm">{members?.length || 0} pessoas no total</p>
        </div>
        <button className="bg-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-black active-scale flex items-center gap-1">
          + Novo
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative px-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nome ou e-mail" 
          className="w-full bg-secondary/50 border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {(!members || members.length === 0) ? (
          <div className="text-center py-12 glass rounded-3xl border border-dashed">
            <p className="text-muted-foreground">Nenhum membro encontrado.</p>
          </div>
        ) : (
          members.map((member: any) => (
            <div key={member.id} className="glass p-4 rounded-3xl border flex items-center gap-4 active-scale shadow-sm">
              <Avatar fallback={member.name} className="h-12 w-12" />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{member.name}</h3>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <p className="text-[11px] text-muted-foreground truncate">{member.email || 'Sem e-mail'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="indigo" className="text-[9px] py-0 px-2">Membro</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 text-muted-foreground/50 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-muted-foreground/50 hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <FAB />
    </div>
  )
}
