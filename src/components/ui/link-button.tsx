import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type LinkButtonVariant = 'primary' | 'secondary' | 'ghost' | 'nav' | 'project'
type LinkButtonSize = 'sm' | 'md' | 'icon'

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  icon?: ElementType
  iconOnly?: boolean
  size?: LinkButtonSize
  variant?: LinkButtonVariant
}

export function LinkButton({
  children,
  className,
  icon: Icon,
  iconOnly = false,
  size = 'md',
  variant = 'secondary',
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(
        'ui-link-button',
        `ui-link-button-${variant}`,
        `ui-link-button-${size}`,
        iconOnly && 'ui-link-button-icon-only',
        className,
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {children}
    </a>
  )
}
