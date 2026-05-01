'use client'

import { Search, Plus, ChevronDown } from 'lucide-react'
import { LogoutButton } from './logout-button'
import { useChurch } from './church-context'

export function TopBar({ churchName, userRole }: { churchName?: string, userRole?: string }) {
  const { churches, currentChurchId, setChurch } = useChurch()

  return (
    <header className="sticky top-0 z-40 w-full glass border-b px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-sm shadow-primary/20">
          IG
        </div>
        
        {userRole === 'global_admin' ? (
          <div className="relative flex items-center group">
            <select 
              value={currentChurchId || ''} 
              onChange={(e) => setChurch(e.target.value)}
              className="appearance-none bg-transparent font-semibold text-sm pr-6 focus:outline-hidden cursor-pointer max-w-[140px] truncate"
            >
              <option value="" disabled>Selecionar Igreja</option>
              {churches.map(church => (
                <option key={church.id} value={church.id}>{church.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none text-muted-foreground" />
          </div>
        ) : (
          <span className="font-semibold text-sm truncate max-w-[140px]">
            {churchName || 'Igreja Interna'}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <button className="p-2 text-muted-foreground active-scale">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-muted-foreground active-scale">
          <Plus className="w-5 h-5" />
        </button>
        <div className="ml-1 border-l pl-2 border-border">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
