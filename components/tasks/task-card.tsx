'use client'

import { toggleTaskCompleteAction, deleteTaskAction } from '@/actions/task-actions'
import type { Task } from '@/lib/types/task'
import { cn } from '@/lib/cn'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

type Props = {
  task: Task
  context: 'today' | 'upcoming' | 'backlog' | 'bin'
}

export function TaskCard({ task, context }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const done = Boolean(task.completed_at)

  const toggleCompletion = () => {
    startTransition(async () => {
      await toggleTaskCompleteAction(task.id, !done)
      router.refresh()
    })
  }

  const erase = () => {
    startTransition(async () => {
      await deleteTaskAction(task.id)
      router.refresh()
    })
  }

  return (
    <motion.article
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group rounded-3xl border border-white/10 bg-white/[0.038] backdrop-blur-2xl p-5 shadow-inner',
        pending && 'opacity-70 pointer-events-none',
      )}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => toggleCompletion()}
          className={cn(
            'mt-0.5 h-10 w-10 shrink-0 rounded-2xl border border-white/10 transition-colors',
            done ? 'bg-accent/90 text-slate-950 border-accent/60' : 'bg-white/[0.04] hover:bg-white/[0.08]',
          )}
          aria-label={done ? 'Mark incomplete' : 'Mark completed'}
          aria-busy={pending}
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col gap-2">
            <h3 className={cn('text-base font-semibold leading-snug', done && 'line-through opacity-60')}>{task.title}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.24em] text-white/50">
              <span>Scheduled {prettyDate(task.due_date)}</span>
              <span className="h-3 w-[1px] bg-white/20" aria-hidden />
              <span>{contextBadge(context)}</span>
              <span className="h-3 w-[1px] bg-white/20" aria-hidden />
              <span>Created {prettyDate(tsToDay(task.created_at))}</span>
            </div>
          </div>

          {task.note && (
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{task.note}</p>
          )}

          {task.completed_at && (
            <p className="text-xs text-neutral-500 tracking-wide uppercase">Completed · {friendlyDate(task.completed_at)}</p>
          )}
        </div>
      </div>

      {context === 'bin' && (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => erase()}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200/80 hover:text-rose-200"
          >
            Delete forever
          </button>
        </div>
      )}
    </motion.article>
  )
}

function contextBadge(view: Props['context']) {
  switch (view) {
    case 'today':
      return 'Today'
    case 'upcoming':
      return 'Upcoming'
    case 'backlog':
      return 'Backlog'
    default:
      return 'Successful Bin'
  }
}

function tsToDay(isoTs: string) {
  try {
    return isoTs.slice(0, 10)
  } catch {
    return isoTs
  }
}

function friendlyDate(ts: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts))
  } catch {
    return ts
  }
}

function prettyDate(isoDay: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(
      new Date(`${isoDay}T12:00:00`),
    )
  } catch {
    return isoDay
  }
}
