'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Today', href: '/today' },
  { label: 'Soon', href: '/upcoming' },
  { label: 'Backlog', href: '/backlog' },
  { label: 'Done', href: '/bin' },
  { label: 'You', href: '/settings' },
]

export function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="fixed bottom-6 left-4 right-4 z-40 md:hidden">
      <div className="rounded-[30px] border border-white/10 bg-black/55 px-5 py-[10px] shadow-[0_18px_50px_rgb(10_12_32/0.55)] backdrop-blur-3xl supports-[backdrop-filter]:bg-black/42">
        <ul className="flex items-center justify-between gap-[6px] text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href)

            return (
              <li key={href}>
                <Link
                  prefetch
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-3xl px-3 py-[10px] text-center transition-colors ${
                    active ? 'bg-white/15 text-white' : 'hover:bg-white/[0.08]'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
