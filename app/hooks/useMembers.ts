'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useChurch } from '@/app/components/church-context'

export function useMembers() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const { currentChurchId } = useChurch()
  const supabase = createClient()

  const fetchMembers = async () => {
    if (!currentChurchId) {
      setMembers([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('church_id', currentChurchId)
        .order('name')

      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [currentChurchId])

  return { members, loading, error, refetch: fetchMembers }
}
