import 'server-only'

import type { Profile } from '@/lib/types/task'
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const ensureViewerProfile = cache(async (): Promise<{ userId: string; email: string | null; profile: Profile }> => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile) {
    await supabase.from('profiles').insert({ id: user.id })
    const hydrated = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = hydrated.data ?? null

    if (hydrated.error) {
      console.error(hydrated.error)
    }
  }

  if (!profile) {
    throw new Error('Unable to hydrate your profile.')
  }

  return { userId: user.id, email: user.email ?? null, profile }
})
