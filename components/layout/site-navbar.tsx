'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PRIMARY_BASE, PRIMARY_SOFT } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { NextTaskLogoLockup } from '@/components/brand/brand-logo'

type Props =
  | { variant: 'marketing' }
  | { variant: 'auth'; backHref?: string; backLabel?: string }

export function SiteNavbar(props: Props) {
  const isMarketing = props.variant === 'marketing'

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 0.74, 0.27, 0.94] }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-6 sm:px-6 lg:px-10"
    >
      <nav
        className="glass-panel mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-5 py-[14px] sm:rounded-[34px]"
        aria-label="Primary navigation"
      >
        <NextTaskLogoLockup href="/" prefetch className="-ml-1" />

        <div className="ml-auto flex flex-wrap items-center gap-4">
          {!isMarketing && props.variant === 'auth' ? (
            <Link
              href={props.backHref ?? '/'}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-white/61 transition-colors hover:text-white"
            >
              {props.backLabel ?? 'Home'}
            </Link>
          ) : null}

          {isMarketing ? (
            <>
              <Link href="/login" prefetch className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60 hover:text-neutral-50">
                Log in
              </Link>
              <Link
                href="/signup"
                prefetch
                className={cn(PRIMARY_SOFT, PRIMARY_BASE)}
              >
                Get started
              </Link>
            </>
          ) : null}
        </div>
      </nav>
    </motion.header>
  )
}
