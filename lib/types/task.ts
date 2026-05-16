export type Task = {
  id: string
  user_id: string
  title: string
  note: string | null
  due_date: string
  created_at: string
  completed_at: string | null
}

export type Profile = {
  id: string
  timezone: string
  display_name: string | null
  created_at: string
  updated_at: string
}
