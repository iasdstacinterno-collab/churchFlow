import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session) {
      
      // Feature: Link member by email automatically
      if (data.session.user?.email) {
         await supabase.from('members')
            .update({ user_id: data.session.user.id })
            .eq('email', data.session.user.email)
            .is('user_id', null)
      }

      // Feature: Save offline refresh token for Google Calendar Sync
      if (data.session.provider_refresh_token) {
         await supabase.from('user_integrations').upsert({
            user_id: data.session.user.id,
            provider: 'google',
            refresh_token: data.session.provider_refresh_token
         }, { onConflict: 'user_id, provider' })

         return NextResponse.redirect(`${origin}/profile?syncing=true`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
