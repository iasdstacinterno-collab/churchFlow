'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function createDepartment(formData: FormData) {
  const name = formData.get('name') as string
  const leader_id = formData.get('leader_id') as string

  if (!name) return { error: 'Nome é obrigatório' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: profile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  let churchId = profile?.church_id
  if (profile?.role === 'global_admin') {
    const cookieStore = await cookies()
    churchId = cookieStore.get('active_church_id')?.value
  }

  if (!churchId) return { error: 'Igreja não identificada' }

  const { error } = await supabase.from('departments').insert({
    name,
    leader_id: leader_id || null,
    church_id: churchId
  })

  if (error) return { error: error.message }

  revalidatePath('/departments')
  return { success: true }
}

export async function updateDepartment(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const leader_id = formData.get('leader_id') as string

  if (!id || !name) return { error: 'Dados inválidos' }

  const supabase = await createClient()
  const payload: any = { name }
  if (leader_id !== undefined) payload.leader_id = leader_id || null

  const { error } = await supabase.from('departments').update(payload).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/departments')
  revalidatePath(`/departments/${id}`)
  return { success: true }
}

export async function deleteDepartment(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('departments').delete().eq('id', id)

  if (error) return { error: 'Não foi possível excluir o departamento. Existem membros ou escalas atrelados a ele.' }

  revalidatePath('/departments')
  return { success: true }
}
