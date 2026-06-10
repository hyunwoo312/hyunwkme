import type { SymbolName } from '../data/portfolio'
import { SymbolIcon } from './Symbols'

type SectionHeaderProps = {
  icon?: SymbolName
  title: string
}

export function SectionHeader({ icon = 'clover', title }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <div className="header-line" />
      <SymbolIcon name={icon} variant={icon} />
    </div>
  )
}
