'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChurch(formData: FormData) {
  const name = formData.get('name')
  
  if (!name || typeof name !== 'string') return { error: 'Nome inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('churches').insert({ name })

  if (error) return { error: error.message }
  
  revalidatePath('/churches')
  revalidatePath('/dashboard', 'layout')
  return { success: true }
}

export async function updateChurch(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  
  if (!id || !name) return { error: 'Dados inválidos' }

  const supabase = await createClient()
  const { error } = await supabase.from('churches').update({ name }).eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/churches')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteChurch(formData: FormData) {
  const id = formData.get('id') as string
  
  if (!id) return { error: 'ID inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('churches').delete().eq('id', id)

  if (error) return { error: error.message } // likely foreign key constraint unless cascades are set
  
  revalidatePath('/churches')
  revalidatePath('/', 'layout')
  return { success: true }
}
