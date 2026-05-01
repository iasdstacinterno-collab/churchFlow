'use client'

import { setActiveChurch } from '@/app/(dashboard)/actions'
import { LogoutButton } from './logout-button'

export function Header({ profile, churches, activeChurchId }: { profile: any, churches?: any[], activeChurchId?: string }) {
  const isGlobalAdmin = profile?.role === 'global_admin'

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {isGlobalAdmin ? (
          <select 
            value={activeChurchId || ''} 
            onChange={(e) => setActiveChurch(e.target.value)}
            className="h-9 w-full max-w-[200px] md:max-w-[256px] rounded-md border border-input bg-transparent px-2 md:px-3 text-xs md:text-sm shadow-sm font-medium focus:ring-1 focus:ring-ring"
          >
            <option value="" disabled>Igreja...</option>
            {churches?.map(c => (
               <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        ) : (
          <span className="text-xs md:text-sm text-primary font-semibold bg-primary/10 px-2 md:px-3 py-1 rounded-full border border-primary/20 truncate max-w-[120px] md:max-w-none">Igreja Interna</span>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4 text-sm shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-0">
          <span className="font-medium text-foreground leading-tight">{profile?.name}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{profile?.role}</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
