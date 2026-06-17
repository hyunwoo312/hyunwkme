import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from 'react'
import { useInView } from 'motion/react'
import { cn } from '../../lib/cn'

type CursorStyle = 'block' | 'line' | 'underscore'

type TypingAnimationProps<T extends ElementType = 'span'> = {
  as?: T
  blinkCursor?: boolean
  children?: string
  className?: string
  cursorStyle?: CursorStyle
  delay?: number
  deleteSpeed?: number
  loop?: boolean
  pauseDelay?: number
  showCursor?: boolean
  startOnView?: boolean
  typeSpeed?: number
  words?: string[]
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

function getPrefersReducedMotion() {
  if (typeof window === 'undefined') {
    return true
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getWords(children: string | undefined, words: string[] | undefined) {
  if (words && words.length > 0) {
    return words
  }

  return children ? [children] : ['']
}

export function TypingAnimation<T extends ElementType = 'span'>({
  as,
  blinkCursor = true,
  children,
  className,
  cursorStyle = 'line',
  delay = 0,
  deleteSpeed = 50,
  loop = false,
  pauseDelay = 1000,
  showCursor = true,
  startOnView = true,
  typeSpeed = 100,
  words,
  ...props
}: TypingAnimationProps<T>) {
  const Component = as ?? 'span'
  const elementRef = useRef<HTMLElement>(null)
  const hasAppliedDelayRef = useRef(false)
  const isInView = useInView(elementRef, { once: true, margin: '-10% 0px' })
  const prefersReducedMotion = getPrefersReducedMotion()
  const resolvedWords = useMemo(() => getWords(children, words), [children, words])
  const [wordIndex, setWordIndex] = useState(0)
  const [characterIndex, setCharacterIndex] = useState(() =>
    prefersReducedMotion ? resolvedWords[0]?.length ?? 0 : 0,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const hasStarted = !startOnView || isInView

  useEffect(() => {
    if (prefersReducedMotion || !hasStarted) {
      return undefined
    }

    const currentWord = resolvedWords[wordIndex] ?? ''
    const isWordComplete = characterIndex === currentWord.length
    const isWordDeleted = characterIndex === 0
    const isLastWord = wordIndex === resolvedWords.length - 1

    if (isWordComplete && (!loop || resolvedWords.length === 1)) {
      return undefined
    }

    const timeoutDelay = !isDeleting && isWordComplete ? pauseDelay : isDeleting ? deleteSpeed : typeSpeed

    const shouldApplyDelay = !hasAppliedDelayRef.current
    const timeoutId = window.setTimeout(() => {
      hasAppliedDelayRef.current = true

      if (!isDeleting && isWordComplete) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && isWordDeleted) {
        setIsDeleting(false)
        setWordIndex((currentIndex) => (isLastWord ? 0 : currentIndex + 1))
        return
      }

      setCharacterIndex((currentIndex) => currentIndex + (isDeleting ? -1 : 1))
    }, timeoutDelay + (shouldApplyDelay ? delay : 0))

    return () => window.clearTimeout(timeoutId)
  }, [
    characterIndex,
    delay,
    deleteSpeed,
    hasStarted,
    isDeleting,
    loop,
    pauseDelay,
    prefersReducedMotion,
    resolvedWords,
    typeSpeed,
    wordIndex,
  ])

  const currentWord = resolvedWords[wordIndex] ?? ''
  const visibleText = prefersReducedMotion ? resolvedWords[0] : currentWord.slice(0, characterIndex)

  return (
    <Component className={cn('ui-typing-animation', className)} ref={elementRef} {...props}>
      <span className="ui-typing-animation-text">{visibleText}</span>
      {showCursor ? (
        <span
          aria-hidden="true"
          className={cn(
            'ui-typing-animation-cursor',
            `is-${cursorStyle}`,
            blinkCursor && 'is-blinking',
          )}
        />
      ) : null}
    </Component>
  )
}
