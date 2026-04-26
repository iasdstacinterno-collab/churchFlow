'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDepartment(formData: FormData) {
  const name = formData.get('name') as string
  const leader_id = formData.get('leader_id') as string

  if (!name) return { error: 'Nome é obrigatório' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  if (profile?.role !== 'church_manager') {
    return { error: 'Apenas managers podem criar departamentos' }
  }

  const { error } = await supabase.from('departments').insert({
    name,
    church_id: profile.church_id,
    leader_id: leader_id || null
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/departments')
  return { success: true }
}
