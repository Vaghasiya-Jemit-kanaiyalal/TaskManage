import { SignupForm } from '@/components/auth/signup-form'
import { GlassCard } from '@/components/ui/glass-card'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { Suspense } from 'react'

export default function SignupPage() {
  return (
    <div className="relative min-h-dvh">
      <SiteNavbar variant="auth" />
      <main className="flex min-h-dvh items-center justify-center px-4 pb-20 pt-32 md:pt-36">
        <GlassCard className="w-full max-w-lg px-9 py-12 md:p-14">
          <p className="text-[11px] uppercase tracking-[0.52em] text-white/54">Create</p>
          <h1 className="mt-3 text-[32px] font-semibold tracking-tight text-neutral-50">Shape your serene stack</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
            Every workspace is walled to your credentials—nothing leaks across tenants, thanks to hardened row policies by default.
          </p>

          <Suspense fallback={<div className="py-24 text-center text-neutral-400">Preparing signup…</div>}>
            <SignupForm />
          </Suspense>
        </GlassCard>
      </main>
    </div>
  )
}
