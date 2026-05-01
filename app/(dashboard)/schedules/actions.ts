'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSchedule(formData: FormData) {
  const department_id = formData.get('department_id') as string
  const event_type = formData.get('event_type') as string
  const date = formData.get('date') as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string

  if (!department_id || !event_type || !date) return { error: 'Dados inválidos' }

  const supabase = await createClient()

  // Get church_id from department to satisfy RLS
  const { data: dept } = await supabase.from('departments').select('church_id').eq('id', department_id).single()
  if (!dept) return { error: 'Departamento não encontrado' }

  const { error } = await supabase.from('schedules').insert({
    department_id,
    event_type,
    date,
    start_time,
    end_time,
    church_id: dept.church_id
  })

  if (error) return { error: error.message }

  revalidatePath('/schedules')
  revalidatePath(`/departments/${department_id}`)
  return { success: true }
}

export async function updateSchedule(formData: FormData) {
  const id = formData.get('id') as string
  const event_type = formData.get('event_type') as string
  const date = formData.get('date') as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string

  if (!id || !event_type || !date) return { error: 'Dados inválidos' }

  const supabase = await createClient()
  const { error } = await supabase.from('schedules').update({
    event_type, date, start_time, end_time
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/schedules')
  return { success: true }
}

export async function deleteSchedule(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('schedules').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/schedules')
  return { success: true }
}

// Assignments
export async function assignRole(formData: FormData) {
  const schedule_id = formData.get('schedule_id') as string
  const role_name = formData.get('role_name') as string
  const member_id = formData.get('member_id') as string

  if (!schedule_id || !role_name) return { error: 'Dados obrigatórios faltando' }

  const supabase = await createClient()

  // Get church_id from schedule to satisfy RLS if column exists
  const { data: schedule } = await supabase.from('schedules').select('church_id').eq('id', schedule_id).single()
  if (!schedule) return { error: 'Escala não encontrada' }

  const { error } = await supabase.from('schedule_assignments').insert({
    schedule_id,
    role_name,
    member_id: member_id || null,
    church_id: schedule.church_id
  })

  if (error) return { error: error.message }

  revalidatePath('/schedules')
  return { success: true }
}

export async function removeRole(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('schedule_assignments').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/schedules')
  return { success: true }
}
