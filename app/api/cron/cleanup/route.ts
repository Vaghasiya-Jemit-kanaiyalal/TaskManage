import { assertCron } from '@/lib/cron/assert-cron'
import { completedTasksPurgeBeforeIso } from '@/lib/date/effective-local-day'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Removes completed tasks whose completion is older than 5 days (Successful Bin TTL).
 */
export async function GET(request: NextRequest) {
  const denied = assertCron(request)
  if (denied) return denied

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured' },
      { status: 500 },
    )
  }

  const admin = createAdminClient()
  const before = completedTasksPurgeBeforeIso()

  const { error } = await admin.from('tasks').delete().not('completed_at', 'is', null).lt('completed_at', before)

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, purgeBefore: before })
}
