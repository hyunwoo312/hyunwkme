import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { projects, type Project, type ProjectVisualType } from '../data/portfolio'
import { cn } from '../lib/cn'
import { SectionHeader } from './SectionHeader'
import { Badge } from './ui/badge'
import { LinkButton } from './ui/link-button'

const maxShowcaseProjects = 4
const cardActivationMs = 360

type ProjectVisualProps = {
  image?: Project['image']
  type: ProjectVisualType
}

type ProjectCardProps = {
  activating: boolean
  expanded: boolean
  index: number
  onToggle(projectId: Project['id']): void
  project: Project
}

type ProjectPlateListProps = {
  projects: Project[]
}

type ProjectLinksProps = {
  ariaLabel: string
  className: string
  links: ProjectLinkItem[]
}

type ProjectLinkItem = {
  href: string
  icon: 'external' | 'github'
  label: string
}

const statusLabels: Record<Project['status'], string> = {
  archived: 'Archived',
  incoming: 'Incoming',
  live: 'Live',
  released: 'Released',
}

function getProjectLinkItems(project: Project): ProjectLinkItem[] {
  const links = project.links

  if (!links) {
    return []
  }

  return [
    links.github
      ? {
          href: links.github,
          icon: 'github' as const,
          label: project.linkLabels?.github ?? 'GitHub',
        }
      : null,
    links.store
      ? {
          href: links.store,
          icon: 'external' as const,
          label: project.linkLabels?.store ?? 'Store',
        }
      : null,
    links.demo
      ? {
          href: links.demo,
          icon: 'external' as const,
          label: project.linkLabels?.demo ?? 'Live',
        }
      : null,
    links.caseStudy
      ? {
          href: links.caseStudy,
          icon: 'external' as const,
          label: project.linkLabels?.caseStudy ?? 'Case Study',
        }
      : null,
  ].filter((item): item is ProjectLinkItem => item !== null)
}

function ProjectLinks({ ariaLabel, className, links }: ProjectLinksProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <div aria-label={ariaLabel} className={className} role="group">
      {links.map((link) => (
        <LinkButton
          href={link.href}
          icon={link.icon === 'github' ? FaGithub : ExternalLink}
          key={link.href}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          rel="noreferrer"
          target="_blank"
          variant="project"
        >
          {link.label}
        </LinkButton>
      ))}
    </div>
  )
}

function ProjectVisual({ image, type }: ProjectVisualProps) {
  if (image) {
    const imageStyle = {
      objectPosition: image.objectPosition,
    } satisfies CSSProperties

    return (
      <div className="project-visual project-visual-image">
        <img
          alt={image.alt}
          decoding="async"
          height={image.height}
          loading="lazy"
          src={image.src}
          style={imageStyle}
          width={image.width}
        />
      </div>
    )
  }

  if (type === 'wave') {
    return (
      <div className="project-visual visual-pink">
        <svg className="wave-mark" viewBox="0 0 100 100">
          <path d="M10,50 Q30,20 50,50 T90,50" />
        </svg>
      </div>
    )
  }

  if (type === 'panel') {
    return (
      <div className="project-visual visual-blue visual-panel">
        <div className="glass-panel" />
      </div>
    )
  }

  return (
    <div className="project-visual">
      <div className="inner-shape ps-1" />
      <div className="inner-shape ps-2" />
      <div className="interface-wireframe">
        <div className="wire-pill" />
        <div className="wire-rule" />
        <div className="wire-columns">
          <div />
          <div />
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ activating, expanded, index, onToggle, project }: ProjectCardProps) {
  const cardId = `project-card-${project.id}`
  const detailsId = `${cardId}-details`
  const linkItems = getProjectLinkItems(project)
  const canExpand = linkItems.length > 0
  const actionLabel = expanded ? `Close ${project.title} project details` : `Open ${project.title} project details`

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!canExpand || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    onToggle(project.id)
  }

  return (
    <motion.article
      className={cn(
        'project-card project-card-showcase',
        project.className,
        !canExpand && 'is-static',
        activating && 'is-activating',
        expanded && 'is-expanded',
      )}
      initial={{ opacity: 0, y: 28 }}
      layout
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div
        aria-controls={canExpand ? detailsId : undefined}
        aria-describedby={`${cardId}-summary`}
        aria-label={canExpand ? actionLabel : undefined}
        aria-expanded={canExpand ? expanded : undefined}
        className="project-card-button"
        onClick={canExpand ? () => onToggle(project.id) : undefined}
        onKeyDown={handleKeyDown}
        role={canExpand ? 'button' : undefined}
        tabIndex={canExpand ? 0 : undefined}
      >
        <ProjectVisual image={project.image} type={project.visual} />
        {canExpand ? <span className="project-card-affordance">View details</span> : null}
        <div className="project-meta">
          <div className="meta-line" />
          <div className="meta-content">
            <div className="project-eyebrow">
              {project.version ? <span>{project.version}</span> : null}
            </div>
            <h3 className="meta-title" id={cardId}>
              {project.title}
            </h3>
            <p className="project-summary" id={`${cardId}-summary`}>
              {project.summary}
            </p>
            <div className="meta-tags">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="square">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {canExpand && (activating || expanded) ? (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="project-card-expanded"
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              id={detailsId}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="project-detail-stat">
                <span>Built For</span>
                <strong>{project.role}</strong>
              </div>
              <div className="project-detail-stat">
                <span>Stack</span>
                <strong>{project.tags.join(' / ')}</strong>
              </div>
              <p>{project.details ?? project.summary}</p>
              <ProjectLinks
                ariaLabel={`${project.title} project links`}
                className="project-detail-links"
                links={linkItems}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

function ProjectPlateList({ projects }: ProjectPlateListProps) {
  if (projects.length === 0) {
    return null
  }

  return (
    <div className="project-plate-list" aria-label="Additional projects">
      {projects.map((project) => {
        const linkItems = getProjectLinkItems(project)

        return (
          <article className="project-plate" key={project.id}>
            <span className="project-plate-main">
              <span className="project-plate-label">{statusLabels[project.status]}</span>
              <span className="project-plate-title">{project.title}</span>
              <span className="project-plate-summary">{project.summary}</span>
              <span className="project-plate-tags">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="square">
                    {tag}
                  </Badge>
                ))}
              </span>
            </span>
            <ProjectLinks
              ariaLabel={`${project.title} links`}
              className="project-plate-links"
              links={linkItems}
            />
          </article>
        )
      })}
    </div>
  )
}

export function Projects() {
  const activationTimeoutRef = useRef<number | undefined>(undefined)
  const { indexProjects, showcaseProjects } = useMemo(() => {
    const featured = projects.filter((project) => project.featured)
    const showcase = featured.slice(0, maxShowcaseProjects)
    const showcaseIds = new Set(showcase.map((project) => project.id))

    return {
      indexProjects: projects.filter((project) => !showcaseIds.has(project.id)),
      showcaseProjects: showcase,
    }
  }, [])

  const [activatingProjectId, setActivatingProjectId] = useState<string | null>(null)
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (activationTimeoutRef.current) {
        window.clearTimeout(activationTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!expandedProjectId && !activatingProjectId) {
      return undefined
    }

    function handlePointerDown(event: PointerEvent): void {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      if (target.closest('.project-card')) {
        return
      }

      if (activationTimeoutRef.current) {
        window.clearTimeout(activationTimeoutRef.current)
        activationTimeoutRef.current = undefined
      }

      setActivatingProjectId(null)
      setExpandedProjectId(null)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [activatingProjectId, expandedProjectId])

  function toggleProject(projectId: string): void {
    if (activationTimeoutRef.current) {
      window.clearTimeout(activationTimeoutRef.current)
      activationTimeoutRef.current = undefined
    }

    if (expandedProjectId === projectId || activatingProjectId === projectId) {
      setActivatingProjectId(null)
      setExpandedProjectId(null)
      return
    }

    setExpandedProjectId(null)
    setActivatingProjectId(projectId)

    activationTimeoutRef.current = window.setTimeout(() => {
      setActivatingProjectId(null)
      setExpandedProjectId(projectId)
      activationTimeoutRef.current = undefined
    }, cardActivationMs)
  }

  return (
    <section id="work">
      <SectionHeader title="Curated Explorations" />
      <div className="projects-shell">
        <div className="section-copy projects-copy">
          <p>
            A small collection of shipped tools, archived experiments, and ongoing builds across
            browser extensions, launcher plugins, and interactive web systems.
          </p>
        </div>

        <div className="projects-grid" aria-label="Featured projects">
          {showcaseProjects.map((project, index) => (
            <ProjectCard
              activating={activatingProjectId === project.id}
              expanded={expandedProjectId === project.id}
              index={index}
              key={project.id}
              onToggle={toggleProject}
              project={project}
            />
          ))}
          <div className="project-dance-accent" aria-hidden="true">
            <img
              alt=""
              decoding="async"
              height="293"
              loading="lazy"
              src="/projects/evernight-dance-sg.gif"
              width="320"
            />
          </div>
        </div>

        <ProjectPlateList projects={indexProjects} />
      </div>
    </section>
  )
}
