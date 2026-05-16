import { ApplicationShell } from '@/components/layout/application-shell'
import { effectiveLogicalDayIso } from '@/lib/date/effective-local-day'
import { ensureViewerProfile } from '@/lib/data/profile'

export default async function AppSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await ensureViewerProfile()

  const defaultDueIso = effectiveLogicalDayIso(profile.timezone ?? 'UTC')

  return (
    <ApplicationShell profile={profile} defaultDueIso={defaultDueIso}>
      {children}
    </ApplicationShell>
  )
}
