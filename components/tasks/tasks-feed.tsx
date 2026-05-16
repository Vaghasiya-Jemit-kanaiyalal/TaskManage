'use client'

import type { Task } from '@/lib/types/task'
import { TaskCard } from '@/components/tasks/task-card'
import type { ComponentProps } from 'react'

type TaskLane = ComponentProps<typeof TaskCard>['context']

export function TasksFeed({ tasks, context }: { tasks: Task[]; context: TaskLane }) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} context={context} />
      ))}
    </div>
  )
}
