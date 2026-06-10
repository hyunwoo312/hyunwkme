import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function CardSurface({ children, className, ...props }: CardSurfaceProps) {
  return (
    <div className={cn('ui-card-surface', className)} {...props}>
      {children}
    </div>
  )
}
