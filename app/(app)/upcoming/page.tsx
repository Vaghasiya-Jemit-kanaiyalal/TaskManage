import { TasksFeed } from '@/components/tasks/tasks-feed'
import { GlassCard } from '@/components/ui/glass-card'
import { effectiveLogicalDayIso } from '@/lib/date/effective-local-day'
import { ensureViewerProfile } from '@/lib/data/profile'
import { createClient } from '@/lib/supabase/server'
import type { Task } from '@/lib/types/task'

export default async function UpcomingPage() {
  const supabase = await createClient()
  const { profile } = await ensureViewerProfile()

  const today = effectiveLogicalDayIso(profile.timezone ?? 'UTC')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .is('completed_at', null)
    .gt('due_date', today)
    .order('due_date', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  const tasks = (data ?? []) as Task[]

  return (
    <section aria-labelledby="upcoming-heading" className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.46em] text-white/54">Horizon</p>
        <h2 id="upcoming-heading" className="mt-3 text-[30px] font-semibold tracking-tight text-neutral-50">
          Upcoming
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Planned forward work persists exactly as scheduled dates even when viewed days early. Incomplete items naturally fall to backlog once the 01:00 local boundary slips past due.
        </p>
      </div>

      {tasks.length ? (
        <TasksFeed tasks={tasks} context="upcoming" />
      ) : (
        <GlassCard className="text-neutral-300 leading-relaxed">Future calm — stage work with purposeful due dates ahead of now.</GlassCard>
      )}
    </section>
  )
}
