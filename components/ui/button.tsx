import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

export const PRIMARY_SOFT =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1f]'
export const PRIMARY_BASE =
  'bg-accent/90 text-slate-950 shadow-lg shadow-accent/25 hover:bg-accent border border-white/10'
export const GHOST_BASE =
  'border border-white/10 bg-white/5 text-neutral-50 hover:bg-white/10'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        PRIMARY_SOFT,
        variant === 'primary' && PRIMARY_BASE,
        variant === 'ghost' && GHOST_BASE,
        props.disabled ? 'opacity-50 pointer-events-none' : '',
        className,
      )}
    />
  )
}
