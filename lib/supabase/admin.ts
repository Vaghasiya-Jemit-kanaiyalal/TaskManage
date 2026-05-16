import { createClient as createSb } from '@supabase/supabase-js'

/** Service-role client — only inside trusted server contexts (cron, admin scripts). */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createSb(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
