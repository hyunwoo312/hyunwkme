import type { SymbolName } from '../data/portfolio'

export function Symbols() {
  return (
    <svg className="symbols" aria-hidden="true">
      <symbol id="icon-clover" viewBox="0 0 24 24">
        <path d="M12 2C12 2 14 7 19 9C14 11 12 16 12 16C12 16 10 11 5 9C10 7 12 2 12 2Z" />
        <path
          d="M12 8C12 8 14 13 19 15C14 17 12 22 12 22C12 22 10 17 5 15C10 13 12 8 12 8Z"
          opacity="0.6"
          transform="rotate(90 12 12) translate(0 6)"
        />
      </symbol>
      <symbol id="icon-star" viewBox="0 0 24 24">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </symbol>
    </svg>
  )
}

type SymbolIconProps = {
  name: SymbolName
  variant?: SymbolName
}

export function SymbolIcon({ name, variant = 'clover' }: SymbolIconProps) {
  return (
    <svg className={`symbol symbol-${variant}`} aria-hidden="true">
      <use href={`#icon-${name}`} />
    </svg>
  )
}
