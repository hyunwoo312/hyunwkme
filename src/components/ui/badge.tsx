import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type BadgeVariant = 'pill' | 'square'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({ children, className, variant = 'square', ...props }: BadgeProps) {
  return (
    <span className={cn('ui-badge', `ui-badge-${variant}`, className)} {...props}>
      {children}
    </span>
  )
}
