import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

export const navVariant =
  'rounded-pill bg-transparent px-5 py-2 text-nav font-medium text-ink transition duration-300 hover:-translate-y-px hover:bg-white/80 hover:text-accent-nav hover:shadow-nav focus-visible:-translate-y-px focus-visible:bg-white/80 focus-visible:text-accent-nav focus-visible:shadow-nav focus-visible:outline-none'

const buttonVariants = cva('appearance-none whitespace-nowrap', {
  variants: {
    variant: {
      nav: navVariant,
    },
  },
  defaultVariants: {
    variant: 'nav',
  },
})

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant }), className)}
      type={asChild ? type : (type ?? 'button')}
      {...props}
    />
  )
}
