'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useChurch } from '@/components/church-context'

export function useSchedules() {
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)
    const { currentChurchId } = useChurch()
    const supabase = createClient()

    const fetchSchedules = async () => {
        if (!currentChurchId) {
            setSchedules([])
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('schedules')
                .select(`
          *,
          department:departments(name),
          assignments:schedule_assignments(
            id,
            role,
            member:members(id, name, email)
          )
        `)
                .eq('church_id', currentChurchId)
                .order('date', { ascending: false })

            if (error) throw error
            setSchedules(data || [])
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSchedules()
    }, [currentChurchId])

    return { schedules, loading, error, refetch: fetchSchedules }
}
