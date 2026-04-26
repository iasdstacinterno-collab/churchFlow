'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChurch(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'Nome é obrigatório' }

  const supabase = await createClient()

  const { error } = await supabase.from('churches').insert({ name })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/churches')
  return { success: true }
}
