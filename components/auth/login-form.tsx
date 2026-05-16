'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const presetNext = searchParams.get('next') ?? nextPath
  const redirectTarget = sanitizeNext(presetNext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setBusy(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      setBusy(false)
      setError(error.message)
      return
    }

    router.replace(redirectTarget)
    router.refresh()
  }

  return (
    <form className="mt-10 space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-2 text-xs uppercase tracking-[0.32em] text-white/52">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-black/35 px-4 py-[14px] text-sm tracking-normal normal-case text-neutral-50 backdrop-blur-2xl"
        />
      </label>
      <label className="block space-y-2 text-xs uppercase tracking-[0.32em] text-white/52">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-black/35 px-4 py-[14px] text-sm tracking-normal normal-case text-neutral-50 backdrop-blur-2xl"
        />
      </label>

      {error ? <p className="rounded-3xl bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

      <Button type="submit" className="mt-6 w-full" disabled={busy}>
        {busy ? 'Signing in…' : 'Continue'}
      </Button>

      <p className="pt-6 text-center text-sm text-neutral-400">
        New here?{' '}
        <Link className="text-accent hover:text-accent/80" prefetch href={`/signup?next=${encodeURIComponent(redirectTarget)}`}>
          Create an account
        </Link>
      </p>
    </form>
  )
}

function sanitizeNext(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return '/today'
  return value
}
