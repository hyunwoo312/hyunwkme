import { timeline } from '../data/portfolio'
import { SectionHeader } from './SectionHeader'
import { SymbolIcon } from './Symbols'
import { Badge } from './ui/badge'

export function ExperienceTimeline() {
  return (
    <section id="experience">
      <SectionHeader icon="star" title="Trajectory" />
      <div className="section-copy trajectory-copy">
        <p>Work experience, current status, and the technical areas I have been building in.</p>
      </div>
      <div className="experience">
        <div className="exp-line" />
        {timeline.map((item) => (
          <div className={`exp-item${item.isCurrent ? ' exp-item-current' : ''}`} key={item.role}>
            <div className="exp-node">
              <SymbolIcon name={item.icon} />
            </div>
            <div className="exp-content">
              <div className="exp-date">{item.date}</div>
              <h3 className="exp-role">{item.role}</h3>
              <div className="exp-company">{item.company}</div>
              <p className="exp-desc">{item.summary}</p>
              <ul className="exp-bullets">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="exp-tags" aria-label={`${item.role} technologies`}>
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="pill">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
