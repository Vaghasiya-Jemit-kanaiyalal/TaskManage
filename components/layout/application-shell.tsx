'use client'

import type { Profile } from '@/lib/types/task'
import { BottomNavBar } from '@/components/layout/bottom-nav'
import { DesktopRail } from '@/components/layout/desktop-rail'
import { AddTaskPanel } from '@/components/tasks/add-task-panel'
import { NextTaskLogoLockup } from '@/components/brand/brand-logo'
import { usePathname } from 'next/navigation'

export function ApplicationShell({
  profile,
  defaultDueIso,
  children,
}: {
  profile: Profile
  defaultDueIso: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const plannerPaths = ['/today', '/upcoming', '/backlog']
  const showComposer = pathname ? plannerPaths.some((segment) => pathname.startsWith(segment)) : false

  return (
    <div className="relative min-h-dvh pb-[120px] md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-7 md:flex-row md:items-start md:gap-12 md:px-8 md:pt-12 lg:gap-14">
        <DesktopRail />

        <div className="flex-1">
          <header className="mb-8 md:mb-10">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.52em] text-white/55">Mindful Planner</p>
                <div className="mt-4">
                  <NextTaskLogoLockup href="/today" prefetch />
                </div>
                <p className="mt-6 max-w-xl text-base text-neutral-400 leading-relaxed">
                  Private glassmorphic workspaces secured per account—with a planning boundary that listens for 01:00 local rollover.
                </p>
              </div>
              {showComposer && (
                <div className="mt-6 hidden md:flex md:flex-col md:items-end md:gap-4">
                  <AddTaskPanel variant="inline" profile={profile} defaultDueIso={defaultDueIso} />
                </div>
              )}
            </div>
          </header>

          <div className="space-y-6">{children}</div>
        </div>
      </div>

      {showComposer && <AddTaskPanel variant="fab" profile={profile} defaultDueIso={defaultDueIso} />}

      <BottomNavBar />
    </div>
  )
}
