import { NextRequest, NextResponse } from 'next/server'

/**
 * Validates Vercel Cron / manual runs when CRON_SECRET is set.
 */
export function assertCron(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET
  if (!secret) return null
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
