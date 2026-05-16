import { TasksFeed } from '@/components/tasks/tasks-feed'
import { GlassCard } from '@/components/ui/glass-card'
import { effectiveLogicalDayIso } from '@/lib/date/effective-local-day'
import { ensureViewerProfile } from '@/lib/data/profile'
import { createClient } from '@/lib/supabase/server'
import type { Task } from '@/lib/types/task'

export default async function BacklogPage() {
  const supabase = await createClient()
  const { profile } = await ensureViewerProfile()

  const today = effectiveLogicalDayIso(profile.timezone ?? 'UTC')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .is('completed_at', null)
    .lt('due_date', today)
    .order('due_date', { ascending: true })

  if (error) console.error(error)

  const tasks = (data ?? []) as Task[]

  return (
    <section aria-labelledby="backlog-heading" className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.46em] text-white/54">Momentum debt</p>
        <h2 id="backlog-heading" className="mt-3 text-[30px] font-semibold tracking-tight text-neutral-50">
          Backlog
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Incomplete tasks silently slide here whenever your logical calendar passes the scheduled due date boundary (anchored nightly at{' '}
          <span className="text-neutral-200">01:00 {profile.timezone}</span>
          ).
        </p>
      </div>

      {tasks.length ? (
        <TasksFeed tasks={tasks} context="backlog" />
      ) : (
        <GlassCard className="text-neutral-300 leading-relaxed">Backlog shines only when undone promises remain — enjoy the lightness while it lasts.</GlassCard>
      )}
    </section>
  )
}
