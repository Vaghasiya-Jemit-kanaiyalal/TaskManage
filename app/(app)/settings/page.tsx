import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ensureViewerProfile } from '@/lib/data/profile'
import { signOutAction, updateProfileAction } from '@/actions/task-actions'

const fallbackZones = [
  'UTC',
  'America/Los_Angeles',
  'America/New_York',
  'Europe/Berlin',
  'Africa/Johannesburg',
  'Asia/Singapore',
  'Pacific/Auckland',
]

function timezoneOptions(): string[] {
  try {
    const values = Intl.supportedValuesOf?.('timeZone')
    if (!values?.length) {
      return [...fallbackZones].sort()
    }

    return Array.from(new Set(values)).sort()
  } catch {
    return [...fallbackZones].sort()
  }
}

export default async function SettingsPage() {
  const zones = timezoneOptions()

  const { profile, email } = await ensureViewerProfile()

  return (
    <section aria-labelledby="settings-heading" className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.46em] text-white/54">Quiet control</p>
        <h2 id="settings-heading" className="mt-3 text-[30px] font-semibold tracking-tight text-neutral-50">
          Profile · Settings
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Tune your timezone anchor so rollover windows and backlog math stay aligned wherever you roam.
        </p>
      </div>

      <GlassCard className="space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.36em] text-white/54">Authenticated</p>
          <p className="mt-3 text-xl font-semibold text-neutral-100">{email ?? 'Private email'}</p>
        </div>

        <form action={updateProfileAction} className="space-y-5">
          <label className="block space-y-2 text-[11px] uppercase tracking-[0.32em] text-white/55">
            Display name · optional cadence badge
            <input
              name="displayName"
              defaultValue={profile.display_name ?? ''}
              className="w-full rounded-[22px] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-neutral-100 backdrop-blur-2xl"
              placeholder="Aurora / Team"
              maxLength={120}
              autoComplete="nickname"
            />
          </label>

          <label className="block space-y-3 text-[11px] uppercase tracking-[0.32em] text-white/55">
            Timezone · IANA
            <select
              name="timezone"
              defaultValue={profile.timezone ?? 'UTC'}
              className="w-full rounded-[22px] border border-white/10 bg-black/40 px-4 py-[14px] text-sm tracking-normal normal-case text-neutral-100 backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>

          <Button variant="primary" type="submit" className="w-full md:w-auto">
            Preserve preferences
          </Button>
        </form>

        <div className="border-t border-white/10 pt-6">
          <p className="text-sm text-neutral-400">
            Signing out invalidates secured browser cookies instantly. Automated cleanup routes still require the CRON_SECRET bearer token paired with hosting schedules when you configure them on Vercel.
          </p>
          <form action={signOutAction} className="mt-4">
            <Button variant="ghost" type="submit" className="w-full md:w-auto bg-white/10">
              Leave session
            </Button>
          </form>
        </div>
      </GlassCard>
    </section>
  )
}
