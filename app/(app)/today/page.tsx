import { TasksFeed } from '@/components/tasks/tasks-feed'
import { GlassCard } from '@/components/ui/glass-card'
import { effectiveLogicalDayIso } from '@/lib/date/effective-local-day'
import { ensureViewerProfile } from '@/lib/data/profile'
import { createClient } from '@/lib/supabase/server'
import type { Task } from '@/lib/types/task'

export default async function TodayPage() {
  const supabase = await createClient()
  const { profile } = await ensureViewerProfile()

  const today = effectiveLogicalDayIso(profile.timezone ?? 'UTC')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .is('completed_at', null)
    .eq('due_date', today)
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  const tasks = (data ?? []) as Task[]

  return (
    <section aria-labelledby="today-heading" className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.46em] text-white/54">Momentum</p>
        <h2 id="today-heading" className="mt-3 text-[30px] font-semibold tracking-tight text-neutral-50">
          Today · {today}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Only untouched work scheduled on your anchored day appears here once the boundary passes 01:00{' '}
          <span className="text-neutral-200">{profile.timezone}</span>.
        </p>
      </div>

      {tasks.length ? (
        <TasksFeed tasks={tasks} context="today" />
      ) : (
        <GlassCard className="leading-relaxed text-neutral-300">
          Gentle pause — nothing earmarked today. Compose a luminous task floating action on mobile remains within reach.
        </GlassCard>
      )}
    </section>
  )
}
