'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  return (
    <Button variant="outline" size="sm" onClick={async () => {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    }}>Sair</Button>
  )
}
