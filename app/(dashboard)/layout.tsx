import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isGlobalAdmin = profile?.role === 'global_admin'

  let churches: any[] = []
  if (isGlobalAdmin) {
     const { data } = await supabase.from('churches').select('id, name').order('name')
     churches = data || []
  }

  const cookieStore = await cookies()
  const activeChurchId = cookieStore.get('active_church_id')?.value

  return (
    <div className="flex min-h-screen bg-muted/20">
       <Sidebar role={profile?.role} />
       <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Header profile={profile} churches={churches} activeChurchId={activeChurchId} />
          <main className="p-8 flex-1 overflow-y-auto">
            {isGlobalAdmin && !activeChurchId && churches.length > 0 ? (
               <div className="flex h-full items-center justify-center p-6 bg-card text-center text-muted-foreground rounded-lg border shadow-sm">
                  <p>Por favor, selecione uma igreja ativa no topo para continuar o acesso aos módulos (departamentos, usuários, escalas, etc).</p>
               </div>
            ) : (
               children
            )}
          </main>
       </div>
    </div>
  )
}
