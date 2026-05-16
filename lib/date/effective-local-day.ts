/**
 * Logical calendar day switches at **01:00 local** so incomplete work counted for
 * the prior calendar date until after 1 AM (planning/day boundary).
 */
import { subDays } from 'date-fns'
import { TZDate, tz } from '@date-fns/tz'

function isSafeIanaTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone }).format()
    return true
  } catch {
    return false
  }
}

/** Returns `YYYY-MM-DD` for effective logical day in `timeZone` (IANA). */
export function effectiveLogicalDayIso(timeZone: string, anchor: Date = new Date()): string {
  const zone = isSafeIanaTimeZone(timeZone) ? timeZone : 'UTC'
  const now = TZDate.tz(zone, anchor.getTime())
  const logical = now.getHours() < 1 ? subDays(now, 1, { in: tz(zone) }) : now
  const y = logical.getFullYear()
  const m = logical.getMonth() + 1
  const d = logical.getDate()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}`
}

/** Completed tasks with `completed_at` before this threshold are purged (5-day retention). */
export function completedTasksPurgeBeforeIso(now: Date = new Date()): string {
  return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
}
