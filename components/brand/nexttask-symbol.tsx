'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

const LOGO_SPRITE_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' fill='none' viewBox='0 0 96 96'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='18' x2='86' y1='16' y2='78' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23CDE0FF'/%3E%3Cstop offset='1' stop-color='%236C7CFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='96' height='96' x='0' rx='26' fill='%23131624' opacity='0.94'/%3E%3Cpath fill='url(%23g)' d='m28 50 12 12 34-39' stroke='%2398A9FF' stroke-linecap='round' stroke-linejoin='round' stroke-width='9' opacity='0.94'/%3E%3C/svg%3E"

type Props = {
  href?: string
  className?: string
  showWordmark?: boolean
  subtitle?: ReactNode
  trailing?: ReactNode
  prefetch?: AnchorHTMLAttributes<HTMLAnchorElement>['prefetch']
}

export function NextTaskBrandLockup({
  href = '/today',
  className,
  showWordmark = true,
  subtitle,
  trailing,
  prefetch = false,
}: Props) {
  const content = (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.span
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.05] shadow-[0_22px_50px_-20px_rgb(139_156_255/0.8)] backdrop-blur-sm"
        whileHover={{ rotate: [-1.2, 0.8], scale: 1.02 }}
        transition={{ duration: 0.45 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_SPRITE_DATA_URL} alt="" role="presentation" className="h-full w-full" />
      </motion.span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {showWordmark ? (
            <span className="text-lg font-semibold tracking-tight text-neutral-50 sm:text-xl md:text-[22px]">NextTask</span>
          ) : null}
          {subtitle ? <span className="hidden text-[11px] uppercase tracking-[0.36em] text-white/52 sm:inline">{subtitle}</span> : null}
        </div>
        {subtitle && !subtitle ? null : subtitle && typeof subtitle === 'string' ? null : subtitle}
      </div>
      {trailing ? <div className="ml-auto">{trailing}</div> : null}
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href} prefetch={prefetch} className="group inline-flex min-w-0 items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
      {content}
    </Link>
  )
}
