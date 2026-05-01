import * as React from "react"
import { cn } from "@/app/lib/utils"
import { Plus } from "lucide-react"
import Link from 'next/link'

// --- Badge ---
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'indigo'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/20 text-primary border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    destructive: "bg-destructive/20 text-destructive border-destructive/20",
    outline: "border-border text-foreground",
    indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

// --- Avatar ---
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback: string
}

export function Avatar({ src, alt, fallback, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm",
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-[13px] font-bold text-white uppercase">
          {fallback.substring(0, 2)}
        </div>
      )}
    </div>
  )
}

// --- FAB ---
interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export function FAB({ className, children, ...props }: FABProps) {
  return (
    <button
      className={cn(
        "fixed right-6 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active-scale transition-all",
        className
      )}
      {...props}
    >
      {children || <Plus className="h-6 w-6" />}
    </button>
  )
}

// --- SectionHeader ---
interface SectionHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function SectionHeader({ title, description, children }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-4 px-1">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// --- StatCard ---
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  className?: string
  href?: string
}

export function StatCard({ label, value, icon, className, href }: StatCardProps) {
  const content = (
    <>
      <div className="p-2 w-fit rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn("p-4 rounded-2xl border bg-card/40 flex flex-col gap-3 shadow-sm active-scale", className)}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cn("p-4 rounded-2xl border bg-card/40 flex flex-col gap-3 shadow-sm active-scale", className)}>
      {content}
    </div>
  )
}
