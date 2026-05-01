import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const origin = new URL(request.url).origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/calendar.events',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent' // Forces Google to reissue refresh_token
      },
      redirectTo: `${origin}/auth/callback?next=/profile`
    }
  })

  if (error) {
    console.error('Google OAuth Error:', error.message)
    return NextResponse.redirect(`${origin}/profile?error=oauth_error`)
  }

  // Redirect securely to Google's consent screen. 303 code ensures the browser swaps POST for GET.
  return NextResponse.redirect(data.url, 303)
}
