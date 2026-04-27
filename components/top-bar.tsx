'use client'

import { Search, Plus, LogOut } from 'lucide-react'
import { LogoutButton } from './logout-button'

export function TopBar({ churchName }: { churchName?: string }) {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-sm shadow-primary/20">
          IG
        </div>
        <span className="font-semibold text-sm truncate max-w-[140px]">
          {churchName || 'Igreja Interna'}
        </span>
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
