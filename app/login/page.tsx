import { LoginForm } from '@/components/auth/login-form'
import { GlassCard } from '@/components/ui/glass-card'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { Suspense } from 'react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string | string[] }>
}) {
  const resolved = await searchParams
  const nextParamRaw = resolved?.next
  const resolvedNext =
    typeof nextParamRaw === 'string' ? nextParamRaw : Array.isArray(nextParamRaw) ? nextParamRaw[0] ?? '/today' : '/today'

  return (
    <div className="relative min-h-dvh">
      <SiteNavbar variant="auth" />
      <main className="flex min-h-dvh items-center justify-center px-4 pb-16 pt-32 md:pt-36">
        <GlassCard className="w-full max-w-md px-10 py-12 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.52em] text-white/54">Authenticate</p>
          <h1 className="mt-3 text-[32px] font-semibold tracking-tight text-neutral-50">Welcome back</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Sign in and your encrypted session persists securely in hardened cookies scoped to your browser.
          </p>

          <Suspense fallback={<p className="mt-14 text-center text-sm text-neutral-500">Connecting…</p>}>
            <LoginForm nextPath={resolvedNext.startsWith('/') ? resolvedNext : '/today'} />
          </Suspense>
        </GlassCard>
      </main>
    </div>
  )
}
