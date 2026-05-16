'use client'

import { cn } from '@/lib/cn'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const stages = [
  {
    key: 'create',
    title: 'Create in seconds',
    description: 'Capture a title, note, and a due date that honors your planning rhythm.',
    accent: 'from-sky-400/40 to-indigo-500/30',
  },
  {
    key: 'future',
    title: 'Schedule ahead',
    description: 'Future tasks stay parked until their day arrives—no clutter in today’s lane.',
    accent: 'from-fuchsia-400/30 to-indigo-500/30',
  },
  {
    key: 'backlog',
    title: 'Backlog that breathes',
    description: 'Miss the 01:00 boundary? Work slides into backlog until you complete it.',
    accent: 'from-amber-400/40 to-rose-500/30',
  },
  {
    key: 'bin',
    title: 'Successful Bin',
    description: 'Completed wins land in a calm archive for five days, then fade automatically.',
    accent: 'from-emerald-400/40 to-cyan-500/30',
  },
  {
    key: 'delete',
    title: 'Delete with clarity',
    description: 'Remove noise fast when a task no longer serves the story you are building.',
    accent: 'from-slate-200/30 to-slate-500/30',
  },
] as const

type StageKey = (typeof stages)[number]['key']

export function LandingShowcase() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const handle = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % stages.length)
    }, 3200)
    return () => window.clearInterval(handle)
  }, [reduceMotion])

  const active = useMemo(() => stages[index], [index])

  return (
    <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <motion.div
        layout
        className="glass-panel relative overflow-hidden p-7 sm:p-9"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.16, 0.74, 0.27, 0.94] }}
      >
        <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 blur-3xl', active.accent)} />
        <div className="relative space-y-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-white/55">Live showcase</p>
            <div className="flex gap-2">
              {stages.map((stage, idx) => (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={cn(
                    'h-2 w-8 rounded-full transition-all',
                    idx === index ? 'bg-white' : 'bg-white/20 hover:bg-white/40',
                  )}
                  aria-label={`Show ${stage.title}`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-50 sm:text-[30px]">{active.title}</h3>
              <p className="max-w-xl text-base leading-relaxed text-neutral-300">{active.description}</p>
            </motion.div>
          </AnimatePresence>

          <ShowcaseCanvas stage={active.key} reduceMotion={Boolean(reduceMotion)} />
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.key}
            className="glass-panel flex flex-col gap-3 p-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.05, duration: 0.45 }}
          >
            <div className={cn('h-1.5 w-16 rounded-full bg-gradient-to-r', stage.accent)} />
            <p className="text-sm font-semibold text-neutral-100">{stage.title}</p>
            <p className="text-sm leading-relaxed text-neutral-400">{stage.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ShowcaseCanvas({ stage, reduceMotion }: { stage: StageKey; reduceMotion: boolean }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-6 shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,147,255,0.18),_transparent_60%)]" />

      <div className="relative grid gap-4 lg:grid-cols-3">
        <MiniColumn tone="today" highlight={stage === 'create'} />
        <MiniColumn tone="upcoming" highlight={stage === 'future'} />
        <MiniColumn tone="backlog" highlight={stage === 'backlog'} />
      </div>

      <AnimatePresence>{stage === 'bin' ? <BinGlow reduceMotion={reduceMotion} /> : null}</AnimatePresence>
      <AnimatePresence>{stage === 'delete' ? <DeleteRipple reduceMotion={reduceMotion} /> : null}</AnimatePresence>

      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-x-[-30%] top-[-10%] h-52 rounded-[40px] bg-gradient-to-r from-sky-500/30 via-accent/35 to-purple-600/35 blur-[90px]"
          animate={{ rotate: [-4, 2, -3], x: [-10, 12, -6], y: [0, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

function MiniColumn({
  tone,
  highlight,
}: {
  tone: 'today' | 'upcoming' | 'backlog'
  highlight: boolean
}) {
  const label =
    tone === 'today' ? 'Today' : tone === 'upcoming' ? 'Upcoming' : 'Backlog'

  return (
    <motion.div
      layout
      className={cn(
        'rounded-2xl border border-white/[0.08] bg-black/35 p-4 backdrop-blur-2xl',
        highlight ? 'opacity-100 shadow-[0_20px_60px_-32px_rgb(124_147_255/0.98)] ring-2 ring-accent/60' : 'opacity-80',
      )}
      animate={{
        translateY: highlight ? -6 : 0,
        opacity: highlight ? 1 : 0.74,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.32em] text-white/54">
        {label}
        <span className="rounded-full bg-white/10 px-2 py-[2px] text-[9px] text-white">Live</span>
      </div>
      <div className="mt-5 space-y-3">
        {tone === 'today' ? (
          <TaskRow caption="Morning review" muted={!highlight} />
        ) : tone === 'upcoming' ? (
          <TaskRow caption="Quarterly storyline" muted={!highlight} />
        ) : (
          <TaskRow caption="Finalize brief" muted={!highlight} accent="amber" />
        )}
      </div>
    </motion.div>
  )
}

function TaskRow({
  caption,
  muted,
  accent = 'indigo',
}: {
  caption: string
  muted: boolean
  accent?: 'indigo' | 'amber'
}) {
  return (
    <motion.div
      layout
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-[10px]',
        muted && 'scale-[0.98] opacity-60',
      )}
    >
      <div className="flex items-center gap-3">
        <motion.span
          className={cn(
            'h-8 w-8 rounded-xl border border-white/12',
            accent === 'amber' ? 'bg-amber-400/35' : 'bg-accent/25',
          )}
          animate={muted ? { scale: [1, 1, 1] } : { scale: [1, 1.05, 1] }}
          transition={muted ? { duration: 0 } : { duration: 4, repeat: Infinity }}
        />
        <div className="text-sm font-medium text-neutral-100">{caption}</div>
      </div>
    </motion.div>
  )
}

function BinGlow({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-6 rounded-[34px] border border-emerald-300/55 bg-emerald-400/10"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
    >
      <div className="absolute inset-[30%] rounded-[36px] bg-emerald-300/15 blur-[50px]" />
      <motion.p
        className="absolute bottom-10 left-0 right-0 text-center text-sm font-semibold text-emerald-100"
        initial={reduceMotion ? false : { y: 8, opacity: 0 }}
        animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      >
        Successful Bin holds wins for five days
      </motion.p>
    </motion.div>
  )
}

function DeleteRipple({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.span
        aria-hidden
        className="h-36 w-36 rounded-full border border-rose-300/45 bg-rose-400/[0.13]"
        initial={{ scale: reduceMotion ? 1 : 0.45, opacity: reduceMotion ? 0.8 : 0.45 }}
        animate={
          reduceMotion
            ? { scale: [1, 1.05], opacity: [0.8, 0] }
            : {
                scale: [0.6, 1.25],
                opacity: [0.55, 0],
              }
        }
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </div>
  )
}
