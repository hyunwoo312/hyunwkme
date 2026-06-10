import { useEffect, useState } from 'react'
import { GeometricMesh } from './BackgroundMesh'

const fullName = 'Hyunwoo Kim'
const accentStartIndex = fullName.indexOf('Kim')
const typingIntervalMs = 75

function getInitialTypedLength() {
  if (typeof window === 'undefined') {
    return fullName.length
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return fullName.length
  }

  return 0
}

export function IntroScreen() {
  const [typedLength, setTypedLength] = useState(getInitialTypedLength)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return undefined
    }

    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setTypedLength(index)

      if (index >= fullName.length) {
        window.clearInterval(interval)
      }
    }, typingIntervalMs)

    return () => window.clearInterval(interval)
  }, [])

  const typedName = fullName.slice(0, typedLength)

  return (
    <div className="intro-screen" aria-hidden="true">
      <div className="intro-mesh">
        <GeometricMesh className="intro-geo-lines" />
      </div>
      <div className="intro-content">
        <div className="intro-version">PORTFOLIO_V1.0.0</div>
        <div className="intro-logo" aria-label="Hyunwoo Kim">
          {typedName.split('').map((letter, index) => (
            <span
              className={`intro-logo-letter${index >= accentStartIndex ? ' is-accent' : ''}${
                letter === ' ' ? ' is-space' : ''
              }`}
              key={`${letter}-${index}`}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
          <span className="intro-cursor" />
        </div>
        <div className="intro-spinner">
          <span />
          <span />
          <span />
        </div>
        <div className="intro-status">BOOTING PORTFOLIO</div>
      </div>
    </div>
  )
}
