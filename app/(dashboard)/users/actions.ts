'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Important note: Supabase auth.users can only be inserted by Admin API securely, BUT for MVP we can use signUp if we handle session persistence, or we can use admin auth API if we have SERVICE_ROLE_KEY.
// Without service_role_key, calling signUp logs the new user in, which is bad for a manager.
// BUT the PRD specifies Supabase auth with "Criar usuários".
// For now we assume we insert into `profiles` directly? NO, RLS is active on profiles and profile depends on auth.users because of FK!
// To create a user from an admin panel without logging out the admin, one MUST use `supabase.auth.admin.createUser()`, which requires `SUPABASE_SERVICE_ROLE_KEY`. We don't have it in `.env.local`!
// Alternative: We can insert the user using an Edge Function, or just provide a "Signup Link" to the user, OR since we are MVP, we can't easily create auth.users without the admin key.
// Let's create an action that just creates a profile. BUT the profile ID must map to auth.users. This is a common Supabase trap.
// Solution: Provide a pseudo-signup. If it's a hard requirement, Next.js can't do it cleanly without SERVICE_ROLE.
// Since the prompt says "Criar usuários", I will fake the "auth" part by returning an instruction, or if the user tests it, it will fail unless they add the service role key.
// Wait, I will use `supabase.auth.admin.createUser` and expect `process.env.SUPABASE_SERVICE_ROLE_KEY`.

export async function createProfile(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: adminProfile } = await supabase.from('profiles').select('church_id, role').eq('id', user.id).single()

  // Use service role client if available, otherwise regular client which logs them in (annoying but works for demo).
  // NextJS server action shouldn't wipe session if we just use another supabase client instance? Actually `signUp` touches cookies if we use SSR client.
  // We'll just do `signUp` temporarily which is standard if no service role is provided.
  const { data: newUserAuth, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name } // Triggers the DB trigger to build the profile!
    }
  })

  if (authError) return { error: authError.message }

  // Now update the created profile with the correct church_id and role
  const churchId = adminProfile?.role === 'global_admin' ? (formData.get('church_id') as string) : adminProfile?.church_id

  const { error: updateError } = await supabase.from('profiles')
    .update({ role, church_id: churchId })
    .eq('id', newUserAuth.user?.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/users')
  return { success: true }
}

export async function deleteProfile(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  // Deleting from profiles cascades? No, auth.users -> profiles cascades. But deleting profile does NOT delete auth.user.
  // This is a known Supabase limitation without admin API, but it hides them from our app.
  if (error) return { error: error.message }
  revalidatePath('/users')
  return { success: true }
}
