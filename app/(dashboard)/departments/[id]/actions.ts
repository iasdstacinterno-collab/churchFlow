'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMember(formData: FormData) {
  const department_id = formData.get('department_id') as string
  const member_id = formData.get('member_id') as string

  if (!member_id || !department_id) return { error: 'Membro inválido.' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  // RLS covers correctness for `church_manager`, so we can attempt to insert directly
  const { error } = await supabase.from('department_members').insert({
    department_id,
    member_id
  })

  if (error) {
    if (error.code === '23505') return { error: 'Membro já adicionado.' }
    return { error: error.message }
  }

  revalidatePath(`/departments/${department_id}`)
  return { success: true }
}

export async function removeMember(formData: FormData) {
  const id = formData.get('id') as string
  const department_id = formData.get('department_id') as string

  const supabase = await createClient()
  const { error } = await supabase.from('department_members').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/departments/${department_id}`)
  return { success: true }
}
