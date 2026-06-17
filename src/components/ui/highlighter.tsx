import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { useInView } from 'motion/react'
import { annotate } from 'rough-notation'
import type { RoughAnnotation, RoughAnnotationType } from 'rough-notation/lib/model'
import { cn } from '../../lib/cn'

type HighlighterProps = ComponentPropsWithoutRef<'span'> & {
  action?: RoughAnnotationType
  animationDuration?: number
  children: ReactNode
  color?: string
  isView?: boolean
  iterations?: number
  multiline?: boolean
  padding?: number | [number, number] | [number, number, number, number]
  showDelay?: number
  strokeWidth?: number
}

export function Highlighter({
  action = 'highlight',
  animationDuration = 500,
  children,
  className,
  color = '#ffd1dc',
  isView = false,
  iterations = 2,
  multiline = true,
  padding = 2,
  showDelay = 0,
  strokeWidth = 1.5,
  ...props
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const hasShownRef = useRef(false)
  const showTimeoutRef = useRef<number | null>(null)
  const isInView = useInView(elementRef, { once: true, margin: '-10% 0px' })
  const shouldShow = isView ? isInView : true

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return undefined
    }

    annotationRef.current?.remove()
    annotationRef.current = annotate(element, {
      animationDuration,
      color,
      iterations,
      multiline,
      padding,
      strokeWidth,
      type: action,
    })
    hasShownRef.current = false

    if (shouldShow) {
      showTimeoutRef.current = window.setTimeout(() => {
        annotationRef.current?.show()
        hasShownRef.current = true
      }, showDelay)
    }

    return () => {
      if (showTimeoutRef.current !== null) {
        window.clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
      }
      annotationRef.current?.remove()
      annotationRef.current = null
    }
  }, [
    action,
    animationDuration,
    color,
    iterations,
    multiline,
    padding,
    shouldShow,
    showDelay,
    strokeWidth,
  ])

  return (
    <span className={cn('ui-highlighter', className)} ref={elementRef} {...props}>
      {children}
    </span>
  )
}
