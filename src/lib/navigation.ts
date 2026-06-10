import type { NavItem } from '../data/portfolio'

export function scrollToSection(targetId: NavItem['targetId']): void {
  document.getElementById(targetId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
