'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { PRIMARY_BASE, PRIMARY_SOFT } from '@/components/ui/button'
import { LandingShowcase } from '@/components/landing/landing-showcase'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { cn } from '@/lib/cn'

export function LandingExperience() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(124,147,255,0.38),_transparent_55%),linear-gradient(#05060f_0%,_#060816_54%,_#03040b_100%)]">
      <FloatingGradients paused={reduceMotion ?? false} />
      <SiteNavbar variant="marketing" />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-[120px] px-5 pb-24 pt-[140px] sm:px-8 lg:px-10 lg:gap-32">
        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center">
          <div className="space-y-8">
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.52em] text-white/62"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              Quiet productivity · luminous focus
            </motion.p>

            <motion.div
              className="space-y-7"
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: [0.16, 0.74, 0.27, 0.94] }}
            >
              <h1 className="text-[40px] font-semibold leading-[1.05] tracking-tight text-neutral-50 sm:text-[52px] lg:text-[56px]">
                Calm rituals for founders who crave{' '}
                <span className="bg-gradient-to-r from-neutral-50 via-accent to-purple-300 bg-clip-text text-transparent">momentum without noise.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-neutral-300">
                Sculpt your day across Today, Upcoming, Backlog, and a fleeting Successful Bin—all wrapped inside a glass-soft interface that respects your timezone and your pace.
              </p>
                <Link href="/signup" prefetch className={cn(PRIMARY_SOFT, PRIMARY_BASE, 'rounded-2xl px-8 py-3')}>
                  Start free
                </Link>
                <Link
                  href="/login"
                  prefetch
                  className="rounded-2xl border border-white/12 bg-black/34 px-7 py-[11px] text-sm font-medium text-neutral-50 backdrop-blur-2xl transition-colors hover:bg-white/[0.08]"
                >
                  I already have an account
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 0.74, 0.27, 0.94] }}
          >
            <div className="glass-panel relative overflow-hidden p-10">
              <div className="absolute inset-[16%] rounded-[52px] bg-gradient-to-br from-accent/45 via-purple-600/38 to-transparent opacity-85 blur-[86px]" />
              <motion.div
                className="relative space-y-8"
                animate={reduceMotion ? undefined : { y: [-4, 2, -3] }}
                transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              >
                <HeroStat eyebrow="01:00 local boundary" value="Backlog choreography" caption="Automatically breathes undone work forward without judgment." />
                <HeroStat eyebrow="Five-day halo" value="Successful Bin" caption="Completed tasks stay visible briefly, then vanish cleanly." inverted />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="space-y-14">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.46em] text-white/55">Showcase · motion study</p>
            <h2 className="text-4xl font-semibold tracking-tight text-neutral-50 sm:text-[40px]">See the loop your days will inhabit.</h2>
          </div>
          <LandingShowcase />
        </section>

        <section className="glass-panel px-10 py-16 text-center sm:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/62">Momentum</p>
          <h3 className="mt-6 text-[32px] font-semibold tracking-tight text-neutral-50 sm:text-[38px]">Ready when you are.</h3>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-300">
            Invite your future self back into clarity with a SaaS-crafted surface that listens more than it shouts—and keeps tasks bound to each account with secure defaults baked in behind the curtain.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/signup" prefetch className={cn(PRIMARY_SOFT, PRIMARY_BASE, 'rounded-2xl px-10 py-[14px] text-base')}>
              Create your vault
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

function FloatingGradients({ paused }: { paused: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] opacity-95">
      <motion.div
        className="absolute -top-44 left-[-10%] h-[560px] w-[560px] rounded-full bg-gradient-to-br from-sky-500/45 via-accent/42 to-purple-600/43 blur-[150px]"
        animate={paused ? undefined : { y: [-10, 20, -6], rotate: [-8, -2, -6], scale: [0.94, 1.04, 0.98] }}
        transition={paused ? undefined : { duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-22%] right-[-22%] h-[620px] w-[620px] rounded-full bg-gradient-to-bl from-purple-700/52 via-accent/41 to-transparent blur-[167px]"
        animate={paused ? undefined : { y: [-16, -6, -12], x: [-6, 12, -4], opacity: [0.55, 0.92, 0.7] }}
        transition={paused ? undefined : { duration: 26, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-[12%] top-[42%] h-[370px] rounded-[48px] bg-gradient-to-tr from-white/12 via-accent/38 to-purple-900/52 blur-[120px]"
        animate={paused ? undefined : { scale: [1, 1.04, 0.98], opacity: [0.45, 0.8, 0.55] }}
        transition={paused ? undefined : { duration: 18, repeat: Infinity, repeatType: 'mirror' }}
      />
    </div>
  )
}

function HeroStat({
  eyebrow,
  value,
  caption,
  inverted,
}: {
  eyebrow: string
  value: string
  caption: string
  inverted?: boolean
}) {
  return (
    <article
      className={cn(
        'rounded-[30px] border border-white/[0.06] px-9 py-7 shadow-inner shadow-black/40 backdrop-blur-2xl',
        inverted ? 'bg-gradient-to-br from-white/[0.15] via-white/[0.05] to-black/52' : 'bg-gradient-to-br from-black/55 via-black/42 to-accent/29',
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-white/62">{eyebrow}</p>
      <p className="mt-6 text-[30px] font-semibold tracking-tight text-neutral-50">{value}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-200">{caption}</p>
    </article>
  )
}
