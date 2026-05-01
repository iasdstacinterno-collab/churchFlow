'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function createMember(formData: FormData) {
  const name = formData.get('name') as string
  const whatsapp = formData.get('whatsapp') as string
  const email = formData.get('email') as string

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

  const { error } = await supabase.from('members').insert({
    name,
    whatsapp: whatsapp || null,
    email: email || null,
    church_id: churchId
  })

  if (error) return { error: error.message }

  revalidatePath('/members')
  return { success: true }
}

export async function updateMember(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const whatsapp = formData.get('whatsapp') as string
  const email = formData.get('email') as string

  if (!id || !name) return { error: 'Dados inválidos' }

  const supabase = await createClient()

  const { error } = await supabase.from('members').update({
    name,
    whatsapp: whatsapp || null,
    email: email || null
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/members')
  return { success: true }
}

export async function deleteMember(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('members').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/members')
  return { success: true }
}
