import { TasksFeed } from '@/components/tasks/tasks-feed'
import { GlassCard } from '@/components/ui/glass-card'
import { completedTasksPurgeBeforeIso } from '@/lib/date/effective-local-day'
import { ensureViewerProfile } from '@/lib/data/profile'
import { createClient } from '@/lib/supabase/server'
import type { Task } from '@/lib/types/task'

export default async function BinPage() {
  const supabase = await createClient()
  const { profile } = await ensureViewerProfile()

  const cutoffIso = completedTasksPurgeBeforeIso()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .not('completed_at', 'is', null)
    .gte('completed_at', cutoffIso)
    .order('completed_at', { ascending: false })

  if (error) console.error(error)

  const tasks = (data ?? []) as Task[]

  return (
    <section aria-labelledby="bin-heading" className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.46em] text-white/54">Celebration ledger</p>
        <h2 id="bin-heading" className="mt-3 text-[30px] font-semibold tracking-tight text-neutral-50">
          Successful Bin
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Gentle closure for what you finished in the past five rolling days ({profile.timezone} reference). Automated cleanup trims anything older nightly via cron + service role purge.
        </p>
      </div>

      {tasks.length ? (
        <TasksFeed tasks={tasks} context="bin" />
      ) : (
        <GlassCard className="text-neutral-300 leading-relaxed">Complete something luminous — completions surface here briefly before archiving away.</GlassCard>
      )}
    </section>
  )
}
