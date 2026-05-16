'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  href?: string
  prefetch?: AnchorHTMLAttributes<HTMLAnchorElement>['prefetch']
  className?: string
  hero?: boolean
  trailing?: ReactNode
}

/** Navbar mark + NextTask lockup (`/logo.svg` in `/public`; replace with PNG if you ship one). */
export function NextTaskLogoLockup({ href, prefetch = false, className, hero = false, trailing }: Props) {
  const sizing = hero ? 'h-14 w-14 sm:h-[68px] sm:w-[68px]' : 'h-11 w-11 sm:h-[46px] sm:w-[46px]'
  const markScale = hero ? 'h-[85%] w-[85%]' : 'h-[82%] w-[82%]'

  const markAndTitle = (
    <>
      <motion.span
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-white/[0.08]',
          sizing,
          'bg-gradient-to-br from-black/45 via-accent/35 to-purple-950/52 shadow-[0_24px_60px_-34px_rgb(124_147_255/0.92)] backdrop-blur',
        )}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      >
        <Image src="/logo.svg" alt="" width={128} height={128} className={cn('object-contain p-3', markScale)} priority />
      </motion.span>
      <span
        className={cn(
          'font-semibold tracking-tight text-neutral-50 drop-shadow-[0_10px_30px_rgb(44_73_214/0.35)]',
          hero ? 'text-[28px] sm:text-[38px]' : 'text-lg sm:text-xl',
        )}
      >
        NextTask
      </span>
    </>
  )

  const body = (
    <div className={cn('inline-flex flex-wrap items-center gap-4', className)}>
      <span className="flex items-center gap-4">{markAndTitle}</span>
      {trailing ? <span className="flex items-center">{trailing}</span> : null}
    </div>
  )

  if (!href) {
    return body
  }

  return (
    <Link
      prefetch={prefetch}
      href={href}
      className="rounded-3xl outline-offset-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent/70"
      aria-label="NextTask home"
    >
      {body}
    </Link>
  )
}
