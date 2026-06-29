import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const badgeVariants = cva('font-mono uppercase leading-none', {
  variants: {
    variant: {
      square: 'rounded-sm border border-ink/20 bg-surface/55 p-2',
      pill: 'rounded-pill border border-ink/10 bg-white/50 px-3 py-1.5 text-chip tracking-wider text-ink/70',
    },
  },
  defaultVariants: {
    variant: 'square',
  },
})

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
