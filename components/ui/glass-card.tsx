import { cn } from '@/lib/cn'

type Props = React.HTMLAttributes<HTMLDivElement>

export function GlassCard({ className, ...props }: Props) {
  return <div {...props} className={cn('glass-panel px-5 py-4', className)} />
}
