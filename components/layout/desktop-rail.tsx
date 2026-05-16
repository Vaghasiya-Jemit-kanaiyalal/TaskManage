'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { NextTaskLogoLockup } from '@/components/brand/brand-logo'

const links = [
  { label: 'Today', href: '/today' },
  { label: 'Upcoming', href: '/upcoming' },
  { label: 'Backlog', href: '/backlog' },
  { label: 'Successful Bin', href: '/bin' },
  { label: 'Profile / Settings', href: '/settings' },
]

export function DesktopRail() {
  const pathname = usePathname()

  return (
    <aside className="hidden shrink-0 md:block md:w-56 lg:w-60">
      <div className="glass-panel sticky top-10 px-4 py-5">
        <NextTaskLogoLockup prefetch href="/today" className="px-4" />
        <p className="mt-10 px-4 text-[10px] font-semibold uppercase tracking-[0.36em] text-white/55">Navigate</p>
        <nav className="mt-6 space-y-1">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href)

            return (
              <Link
                key={href}
                prefetch
                href={href}
                className={cn(
                  'block rounded-2xl px-4 py-3 text-sm font-medium tracking-tight transition-all',
                  active ? 'border border-white/10 bg-white/[0.12] text-neutral-50' : 'text-neutral-400 hover:bg-white/[0.05]',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
