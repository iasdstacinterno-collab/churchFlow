'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function disconnectGoogle() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('user_integrations').delete()
    .eq('user_id', user.id)
    .eq('provider', 'google')

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  return { success: true }
}

export async function syncCalendarBackfill() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const res = await fetch('https://tthwjqtzruojlqqycqhk.supabase.co/functions/v1/google-calendar-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'backfill', user_id: user.id })
    })
    const data = await res.json()
    return { success: true, synced: data.synced }
  } catch (e) {
    return { error: 'Sync API failed' }
  }
}
