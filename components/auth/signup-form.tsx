'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

const siteURL = () => process.env.NEXT_PUBLIC_SITE_URL ?? ''

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = sanitizeNext(searchParams.get('next') ?? '/today')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const redirectUrl = `${siteURL().replace(/\/+$/, '') || 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent(nextParam)}`

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setBusy(true)
    setError(null)

    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    setBusy(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      router.replace(nextParam)
      router.refresh()
      return
    }

    router.push(`/login?next=${encodeURIComponent(nextParam)}`)

    router.refresh()
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={onSubmit}>
      <div className="rounded-3xl border border-accent/35 bg-accent/10 px-4 py-4 text-[13px] leading-relaxed text-neutral-50">
        If confirmation email is enabled for your tenant, finish in your inbox—otherwise sessions return instantly when auto sign‑in succeeds.
      </div>
      <label className="block space-y-2 text-xs uppercase tracking-[0.32em] text-white/52">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-3xl border border-white/12 bg-black/38 px-4 py-[14px] text-sm tracking-normal normal-case text-neutral-50 backdrop-blur-2xl"
        />
      </label>
      <label className="block space-y-2 text-xs uppercase tracking-[0.32em] text-white/52">
        Password · min six characters
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-3xl border border-white/12 bg-black/38 px-4 py-[14px] text-sm tracking-normal normal-case text-neutral-50 backdrop-blur-2xl"
        />
      </label>

      {error ? <p className="rounded-3xl bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

      <Button type="submit" className="mt-8 w-full" disabled={busy}>
        {busy ? 'Creating workspace…' : 'Create workspace'}
      </Button>

      <p className="pt-8 text-center text-sm text-neutral-400">
        Already onboard?{' '}
        <Link className="text-accent hover:text-accent/80" prefetch href={`/login?next=${encodeURIComponent(nextParam)}`}>
          Sign in
        </Link>
      </p>
    </form>
  )
}

function sanitizeNext(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return '/today'
  return value
}
