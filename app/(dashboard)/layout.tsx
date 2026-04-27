import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { TopBar } from '@/components/top-bar'
import { BottomNav } from '@/components/bottom-nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  const cookieStore = await cookies()
  const activeChurchId = cookieStore.get('active_church_id')?.value

  // Fetch church name if activeChurchId exists
  let activeChurchName = 'Igreja Interna'
  if (activeChurchId) {
    const { data } = await supabase.from('churches').select('name').eq('id', activeChurchId).single()
    if (data) activeChurchName = data.name
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md flex flex-col bg-background relative min-h-screen shadow-2xl shadow-indigo-500/10">
        <TopBar churchName={activeChurchName} />
        
        <main className="flex-1 px-4 pt-6 pb-28">
          {children}
        </main>
        
        <BottomNav role={profile?.role} />
      </div>
    </div>
  )
}
