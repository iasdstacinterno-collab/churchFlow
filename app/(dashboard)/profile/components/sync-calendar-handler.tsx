'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { syncCalendarBackfill } from '../actions'
import { RefreshCcw, CheckCircle2 } from 'lucide-react'

export function SyncCalendarHandler({ isSyncing }: { isSyncing: boolean }) {
  const router = useRouter()
  const [synced, setSynced] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isSyncing) {
      const run = async () => {
        const res = await syncCalendarBackfill()
        if (res.success) {
           setCount(res.synced || 0)
        }
        setSynced(true)
        
        // Remove tracking param from URL
        setTimeout(() => {
          router.replace('/profile')
        }, 5000)
      }
      run()
    }
  }, [isSyncing, router])

  if (!isSyncing) return null

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
      {!synced ? (
        <div className="flex items-center text-primary font-medium gap-3 animate-pulse">
          <RefreshCcw className="w-5 h-5 animate-spin" />
          Sincronizando seus eventos futuros com o Google Calendar...
        </div>
      ) : (
         <div className="flex items-center text-emerald-600 font-medium gap-3">
          <CheckCircle2 className="w-5 h-5" />
          {count > 0 ? `Eventos sincronizados com sucesso! (${count} eventos)` : 'Eventos verificados e sincronizados!'}
        </div>
      )}
    </div>
  )
}
