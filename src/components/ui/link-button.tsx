import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { navVariant } from './button'

const glass =
  'rounded-pill border px-4 py-3 gap-2 font-mono text-action uppercase tracking-wider backdrop-blur-[14px] transition duration-300 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none'

const linkButtonVariants = cva(
  'inline-flex items-center no-underline [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: `${glass} border-ink/15 bg-ink/90 text-paper shadow-link-primary hover:bg-ink-deep hover:text-white hover:shadow-link-primary-hover focus-visible:bg-ink-deep focus-visible:text-white focus-visible:shadow-link-primary-hover`,
        secondary: `${glass} border-glass-border bg-surface/40 text-ink/80 shadow-link hover:bg-white/80 hover:text-accent hover:shadow-link-hover focus-visible:bg-white/80 focus-visible:text-accent focus-visible:shadow-link-hover`,
        nav: `${navVariant} gap-0 font-display tracking-normal normal-case whitespace-nowrap`,
        project:
          'justify-center gap-1 rounded-pill border border-ink/15 bg-white/40 px-2.5 py-1 font-mono text-tag uppercase tracking-wider whitespace-nowrap text-ink-light/85 transition duration-300 [&_svg]:size-3 hover:-translate-y-px hover:border-accent/35 hover:bg-white/70 hover:text-accent hover:shadow-project focus-visible:-translate-y-px focus-visible:border-accent/35 focus-visible:bg-white/70 focus-visible:text-accent focus-visible:shadow-project focus-visible:outline-none',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
)

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkButtonVariants> & {
    children: ReactNode
    icon?: ElementType
  }

export function LinkButton({ children, className, icon: Icon, variant, ...props }: LinkButtonProps) {
  return (
    <a className={cn(linkButtonVariants({ variant }), className)} {...props}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      {children}
    </a>
  )
}
