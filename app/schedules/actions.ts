'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSchedule(formData: FormData) {
  const department_id = formData.get('department_id') as string
  const date = formData.get('date') as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string
  const event_type = formData.get('event_type') as string

  if (!department_id || !date || !start_time || !end_time || !event_type) return { error: 'Preencha todos os campos.' }

  const supabase = await createClient()

  const { error } = await supabase.from('schedules').insert({
    department_id, date, start_time, end_time, event_type
  })

  if (error) return { error: error.message }
  revalidatePath('/schedules')
  return { success: true }
}

export async function addScheduleRole(formData: FormData) {
  const schedule_id = formData.get('schedule_id') as string
  const role_name = formData.get('role_name') as string
  const user_id = formData.get('user_id') as string

  const supabase = await createClient()
  const { error } = await supabase.from('schedule_assignments').insert({
    schedule_id, role_name, user_id: user_id || null
  })

  if (error) return { error: error.message }
  revalidatePath('/schedules')
  return { success: true }
}

export async function removeScheduleRole(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('schedule_assignments').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/schedules')
  return { success: true }
}
