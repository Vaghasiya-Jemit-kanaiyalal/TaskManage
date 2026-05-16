'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { effectiveLogicalDayIso } from '@/lib/date/effective-local-day'
import { createClient } from '@/lib/supabase/server'

function revalidateTaskSections() {
  const paths = ['/today', '/upcoming', '/backlog', '/bin', '/settings']
  paths.forEach((p) => revalidatePath(p))
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createTaskAction(input: { title: string; note?: string | null; dueDate: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Please sign in again.')

  const title = input.title.trim()
  if (!title) throw new Error('Add a title for this task.')

  const { data: profile } = await supabase.from('profiles').select('timezone').eq('id', user.id).maybeSingle()

  const tz = profile?.timezone ?? 'UTC'
  const logical = effectiveLogicalDayIso(tz)

  if (input.dueDate < logical) {
    throw new Error('Due date must be today or a future date.')
  }

  const note = input.note?.trim()

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title,
    note: note?.length ? note : null,
    due_date: input.dueDate,
  })

  if (error) throw new Error(error.message)

  revalidateTaskSections()
}

export async function toggleTaskCompleteAction(taskId: string, completed: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Please sign in again.')

  const { error } = await supabase
    .from('tasks')
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq('id', taskId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidateTaskSections()
}

export async function deleteTaskAction(taskId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Please sign in again.')

  const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidateTaskSections()
}

export async function updateProfileAction(formData: FormData) {
  const timezoneField = formData.get('timezone')
  const timezone = typeof timezoneField === 'string' && timezoneField.trim() ? timezoneField.trim() : 'UTC'

  const dn = formData.get('displayName')
  const displayName =
    typeof dn === 'string' && dn.trim().length > 0 ? dn.trim().slice(0, 120) : null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Please sign in again.')

  const { error } = await supabase
    .from('profiles')
    .update({
      timezone,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidateTaskSections()
}
