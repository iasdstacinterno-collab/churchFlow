'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Building2, Users, Calendar, Component, UserCog } from 'lucide-react'

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  
  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ...(isAdmin ? [{ name: 'Igrejas', href: '/churches', icon: Building2 }] : []),
    ...(isAdmin ? [{ name: 'Acesso / Logins', href: '/users', icon: UserCog }] : []),
    { name: 'Membros', href: '/members', icon: Users },
    { name: 'Departamentos', href: '/departments', icon: Component },
    { name: 'Escalas', href: '/schedules', icon: Calendar },
  ]
  
  return (
    <aside className="w-64 bg-card border-r flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold tracking-tight text-primary">ChurchFlow</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon
          const isActive = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
               <Icon className="w-5 h-5" />
               {link.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
