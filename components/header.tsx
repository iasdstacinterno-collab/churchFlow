'use client'

import { setActiveChurch } from '@/app/(dashboard)/actions'
import { LogoutButton } from './logout-button'

export function Header({ profile, churches, activeChurchId }: { profile: any, churches?: any[], activeChurchId?: string }) {
  const isGlobalAdmin = profile?.role === 'global_admin'

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {isGlobalAdmin ? (
          <select 
            value={activeChurchId || ''} 
            onChange={(e) => setActiveChurch(e.target.value)}
            className="h-9 w-64 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm font-medium focus-visible:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="" disabled>Selecionar Igreja Ativa...</option>
            {churches?.map(c => (
               <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Igreja Interna</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium text-foreground">{profile?.name}</span>
        <span className="bg-muted text-muted-foreground border px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">{profile?.role}</span>
        <LogoutButton />
      </div>
    </header>
  )
}
