'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function setActiveChurch(churchId: string) {
  const cookieStore = await cookies()
  cookieStore.set('active_church_id', churchId, { path: '/' })
  revalidatePath('/', 'layout')
}
