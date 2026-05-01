'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useChurch } from '@/app/components/church-context'

export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const { currentChurchId } = useChurch()
  const supabase = createClient()

  const fetchDepartments = async () => {
    if (!currentChurchId) {
      setDepartments([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*, leader:profiles(name)')
        .eq('church_id', currentChurchId)
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [currentChurchId])

  return { departments, loading, error, refetch: fetchDepartments }
}
