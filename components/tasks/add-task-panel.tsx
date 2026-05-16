'use client'

import { createTaskAction } from '@/actions/task-actions'
import type { Profile } from '@/lib/types/task'
import { cn } from '@/lib/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  profile?: Profile | null
  variant?: 'fab' | 'inline'
  /** ISO `yyyy-MM-dd` anchored to the user's logical day boundary. */
  defaultDueIso: string
}

export function AddTaskPanel({ profile, variant = 'fab', defaultDueIso }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [dueDate, setDueDate] = useState(defaultDueIso)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const timezone = profile?.timezone ?? 'UTC'

  useEffect(() => {
    if (!open) {
      setDueDate(defaultDueIso)
    }
  }, [defaultDueIso, open])

  function reset() {
    setTitle('')
    setNote('')
    setDueDate(defaultDueIso)
    setError(null)
  }

  function launch() {
    setDueDate(defaultDueIso)
    setError(null)
    setOpen(true)
  }

  function onSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        const payloadTitle = String(formData.get('title') ?? '')
        const payloadNote = String(formData.get('note') ?? '')
        const payloadDue = String(formData.get('dueDate') ?? '')
        await createTaskAction({ title: payloadTitle, note: payloadNote, dueDate: payloadDue })
        router.refresh()
        setOpen(false)
        reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save')
      }
    })
  }

  return (
    <>
      {variant === 'fab' ? (
        <motion.button
          type="button"
          layoutId="fab"
          onClick={() => launch()}
          className={cn(
            'fixed bottom-[92px] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-[22px]',
            'bg-accent text-slate-950 shadow-2xl shadow-accent/50 border border-white/15 md:hidden',
          )}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Create new task"
        >
          +
        </motion.button>
      ) : (
        <Button variant="primary" type="button" className="w-full md:w-auto" onClick={() => launch()}>
          New task
        </Button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !pending && setOpen(false)}
              aria-hidden
            />
            <motion.div
              className={cn(
                'fixed inset-x-4 bottom-[92px] z-[60] mx-auto max-w-lg rounded-[34px]',
                'border border-white/15 bg-[#12162d]/93 backdrop-blur-3xl p-6 md:w-full md:inset-auto',
                'shadow-[0_45px_100px_rgba(3,8,34,0.88)] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:translate-y-[0]',
              )}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 26, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 316, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="composer-title"
            >
              <header className="flex items-start justify-between gap-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.54em] text-white/52">Quiet composer</p>
                  <h2 id="composer-title" className="mt-2 text-xl font-semibold text-neutral-50">
                    Gentle capture · {timezone}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => !pending && setOpen(false)}
                  className="rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.42em] text-neutral-400 hover:bg-white/10"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </header>

              <form action={onSubmit} className="mt-6 flex flex-col gap-[18px]">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400" htmlFor="title-field">
                    Title
                  </label>
                  <input
                    autoFocus
                    required
                    id="title-field"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief, calm title"
                    className={control()}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[1.05fr_minmax(0,0.95fr)]">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400" htmlFor="due-field">
                      Due date
                    </label>
                    <input
                      required
                      id="due-field"
                      name="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className={control()}
                    />
                  </div>
                  <div className="rounded-3xl border border-white/15 bg-white/5 px-4 py-[18px] text-sm leading-relaxed text-neutral-300">
                    <p className="text-[11px] uppercase tracking-[0.42em] text-white/52">Reminder</p>
                    <p className="mt-2 text-neutral-300">
                      Day boundaries roll forward at{' '}
                      <span className="font-semibold text-neutral-100">01:00 {timezone}</span>. Defaults stay aligned with your logical calendar.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-neutral-400" htmlFor="note-field">
                    Note · optional warmth
                  </label>
                  <textarea
                    id="note-field"
                    name="note"
                    rows={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Context, collaborators, snippets"
                    className={cn(control(), 'resize-none leading-relaxed min-h-[120px]')}
                  />
                </div>

                {error ? <p className="rounded-3xl bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

                <div className="flex flex-col gap-3 pt-3 md:flex-row md:justify-end">
                  <Button type="button" variant="ghost" className="w-full md:w-auto" disabled={pending} onClick={() => !pending && setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="w-full md:w-auto md:min-w-[160px]" disabled={pending}>
                    {pending ? 'Saving…' : 'Anchor task'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function control() {
  return cn(
    'w-full rounded-3xl border border-white/14 bg-white/5 px-4 py-[14px] text-sm text-neutral-50 placeholder:text-neutral-500',
    'focus-visible:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
  )
}
