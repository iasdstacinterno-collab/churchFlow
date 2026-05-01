'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/lib/utils'
import { Home, Calendar, Users, Building2, User } from 'lucide-react'

export function BottomNav({ role }: { role: string | null | undefined }) {
  const pathname = usePathname()

  const allLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Escalas', href: '/schedules', icon: Calendar },
    { name: 'Membros', href: '/members', icon: Users, roles: ['global_admin', 'church_manager', 'department_leader'] },
    { name: 'Deptos', href: '/departments', icon: Building2, roles: ['global_admin', 'church_manager', 'department_leader'] },
    { name: 'Perfil', href: '/profile', icon: User },
  ]

  const links = allLinks.filter(link => !link.roles || (role && link.roles.includes(role)))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t pb-safe">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {links.map(link => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
          return (
            <Link key={link.href} href={link.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all active-scale",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-12 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/10 shadow-sm shadow-primary/5 scale-110" : ""
              )}>
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-wide transition-all",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {link.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
