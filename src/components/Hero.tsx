import type { ElementType, ReactNode } from 'react'
import { motion } from 'motion/react'
import { Download, Mail } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { getContactLink, type ContactLink } from '../data/portfolio'
import { cn } from '../lib/cn'
import { getExternalLinkProps } from '../lib/links'
import { HeroSignature } from './HeroSignature'
import { SymbolIcon } from './Symbols'
import { Badge } from './ui/badge'
import { Highlighter } from './ui/highlighter'
import { LinkButton } from './ui/link-button'
import { TypingAnimation } from './ui/typing-animation'

const heroFacts = ['Houston, TX', 'Open to work', 'Python / TypeScript / Rust / C#']
const heroRoles = ['Fullstack Developer', 'Frontend Engineer', 'Backend Engineer', 'AI Engineer']

type HeroAction = {
  icon: ElementType
  label: string
  link: ContactLink
  variant?: 'primary' | 'secondary'
}

const heroActions: HeroAction[] = [
  {
    icon: Download,
    label: 'Download Resume',
    link: getContactLink('resume'),
    variant: 'primary',
  },
  {
    icon: Mail,
    label: 'Email',
    link: getContactLink('email'),
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    link: getContactLink('github'),
  },
  {
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    link: getContactLink('linkedin'),
  },
]

type AnnotationProps = {
  children: ReactNode
  className: string
  lineWidth?: string
}

function Annotation({ className, children, lineWidth }: AnnotationProps) {
  return (
    <div className={cn('annotation', className)}>
      <div className="annotation-dot" />
      <div className="annotation-line" style={lineWidth ? { width: lineWidth } : undefined} />
      <div className="annotation-content">{children}</div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <motion.div
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        className="hero-center"
        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
        transition={{ delay: 2.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="hero-kicker">HYUNWOO KIM / PORTFOLIO_V1.0.1</p>
        <h1 className="hero-title">
          <HeroSignature />
        </h1>
        <div className="hero-subtitle">
          <SymbolIcon name="star" variant="star" />
          <TypingAnimation
            className="hero-role-typing"
            delay={3650}
            deleteSpeed={45}
            loop
            pauseDelay={2300}
            startOnView={false}
            typeSpeed={75}
            words={heroRoles}
          />
          <SymbolIcon name="clover" variant="clover" />
        </div>
        <p className="hero-bio">
          I build{' '}
          <Highlighter
            action="highlight"
            animationDuration={850}
            color="#bfe9f7"
            isView
            padding={4}
            showDelay={3650}
            strokeWidth={1.8}
          >
            polished web apps
          </Highlighter>
          , developer tools, and automation-heavy software across TypeScript, Python, Rust, and C#.
          Previously{' '}
          <Highlighter
            action="underline"
            animationDuration={750}
            color="#b99cf4"
            isView
            padding={3}
            showDelay={4450}
            strokeWidth={2}
          >
            SDE at AWS
          </Highlighter>
          .
        </p>
        <div className="hero-actions" aria-label="Profile actions">
          {heroActions.map(({ icon: Icon, label, link, variant = 'secondary' }) => {
            return (
              <LinkButton
                download={link.download || undefined}
                href={link.href}
                icon={Icon}
                key={label}
                variant={variant}
                {...getExternalLinkProps(link)}
              >
                {label}
              </LinkButton>
            )
          })}
        </div>
        <div className="hero-facts" aria-label="Profile details">
          {heroFacts.map((fact) => (
            <Badge
              className="border-white/60 bg-white/40 text-ink-light max-md:text-tag"
              key={fact}
              variant="pill"
            >
              {fact}
            </Badge>
          ))}
        </div>
      </motion.div>

      <Annotation className="a-1" lineWidth="120px">
        STATUS: OPEN_TO_WORK
      </Annotation>
      <Annotation className="a-2" lineWidth="150px">
        <span>*</span> BASED_IN_HOUSTON_TEXAS
      </Annotation>
      <Annotation className="a-3">PY / TS / RUST / C#</Annotation>
    </section>
  )
}
