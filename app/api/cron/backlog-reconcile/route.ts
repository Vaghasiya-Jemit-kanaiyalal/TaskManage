import { assertCron } from '@/lib/cron/assert-cron'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Scheduled heartbeat after the 01:00 local planning boundary requirement.
 *
 * Backlog tasks are enforced in the UI by comparing `due_date` with the user's
 * effective logical day (rolls at 01:00 local — see `effectiveLogicalDayIso`).
 * Keeping this cron documents the SLA and lets you attach metrics/alerts later
 * without changing Vercel config.
 */
export async function GET(request: NextRequest) {
  const denied = assertCron(request)
  if (denied) return denied

  return NextResponse.json({
    ok: true,
    mechanics:
      'Backlog derives when `completed_at` is null and `due_date` is before the effective logical calendar day.',
  })
}
