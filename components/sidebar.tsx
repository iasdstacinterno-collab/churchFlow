'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Building2, Users, Calendar, Component, UserCog, Contact, Church, CalendarDays } from 'lucide-react'

export function Sidebar({ role }: { role: string | null | undefined }) {
  const pathname = usePathname()
  
  const isAdmin = role === 'global_admin'
  const isManager = role === 'church_manager' || isAdmin
  const isLeader = role === 'department_leader' || isManager

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ...(isAdmin ? [{ name: 'Acesso / Logins', href: '/users', icon: UserCog }] : []),
    ...(isLeader ? [{ name: 'Membros', href: '/members', icon: Users }] : []),
    ...(isAdmin ? [{ name: 'Igrejas', href: '/churches', icon: Church }] : []),
    ...(isLeader ? [{ name: 'Departamentos', href: '/departments', icon: Building2 }] : []),
    { name: isLeader ? 'Escalas' : 'Minhas Escalas', href: '/schedules', icon: CalendarDays },
    { name: 'Integrações', href: '/profile', icon: Contact },
  ]
  
  return (
    <aside className="hidden md:flex w-64 bg-card border-r flex-col h-screen fixed left-0 top-0 z-10">
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
