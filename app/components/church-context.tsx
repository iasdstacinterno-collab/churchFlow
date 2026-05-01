'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Church = {
  id: string
  name: string
}

type ChurchContextType = {
  currentChurchId: string | null
  churches: Church[]
  setChurch: (id: string) => void
  isLoading: boolean
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined)

export function ChurchProvider({
  children,
  initialChurchId,
  userRole
}: {
  children: React.ReactNode
  initialChurchId: string | null
  userRole: string | null
}) {
  const [currentChurchId, setCurrentChurchId] = useState<string | null>(initialChurchId)
  const [churches, setChurches] = useState<Church[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchChurches() {
      setIsLoading(true)
      try {
        if (userRole === 'global_admin') {
          const { data } = await supabase.from('churches').select('id, name').order('name')
          setChurches(data || [])
        } else if (currentChurchId) {
          const { data } = await supabase.from('churches').select('id, name').eq('id', currentChurchId).single()
          setChurches(data ? [data] : [])
        }
      } catch (error) {
        console.error('Error fetching churches:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChurches()
  }, [userRole, currentChurchId, supabase])

  const setChurch = async (id: string) => {
    setCurrentChurchId(id)
    // Save to cookie via a server action or a simple cookie set
    document.cookie = `active_church_id=${id}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <ChurchContext.Provider value={{ currentChurchId, churches, setChurch, isLoading }}>
      {children}
    </ChurchContext.Provider>
  )
}

export function useChurch() {
  const context = useContext(ChurchContext)
  if (context === undefined) {
    throw new Error('useChurch must be used within a ChurchProvider')
  }
  return context
}
