import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'nav' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

export function Button({ children, className, type = 'button', variant = 'ghost', ...props }: ButtonProps) {
  return (
    <button className={cn('ui-button', `ui-button-${variant}`, className)} type={type} {...props}>
      {children}
    </button>
  )
}
