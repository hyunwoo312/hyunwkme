import type { ElementType } from 'react'
import { FileText, Mail } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { contactLinks, navItems, type ContactLinkType } from '../data/portfolio'
import { getExternalLinkProps } from '../lib/links'
import { scrollToSection } from '../lib/navigation'
import { Button } from './ui/button'
import { LinkButton } from './ui/link-button'

const contactIcons: Record<ContactLinkType, ElementType> = {
  email: Mail,
  github: FaGithub,
  linkedin: FaLinkedinIn,
  resume: FileText,
}

export function FloatingNav() {
  return (
    <nav className="floating-nav" aria-label="Primary navigation">
      <div className="nav-section nav-primary">
        {navItems.map((item) => (
          <Button
            key={item.targetId}
            onClick={() => scrollToSection(item.targetId)}
            variant="nav"
          >
            <span className="nav-label-full">{item.label}</span>
            <span className="nav-label-short">{item.shortLabel}</span>
          </Button>
        ))}
      </div>
      <div className="nav-divider" />
      <div className="nav-section nav-social">
        {contactLinks.map((item) => {
          const Icon = contactIcons[item.type]

          return (
            <LinkButton
              aria-label={item.label}
              download={item.download || undefined}
              href={item.href}
              icon={Icon}
              key={item.href}
              variant="nav"
              {...getExternalLinkProps(item)}
            >
              <span className="sr-only">{item.label}</span>
            </LinkButton>
          )
        })}
      </div>
    </nav>
  )
}
