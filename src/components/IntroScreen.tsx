import { GeometricMesh } from './BackgroundMesh'
import { TypingAnimation } from './ui/typing-animation'

const fullName = 'Hyunwoo Kim'

export function IntroScreen() {
  return (
    <div className="intro-screen" aria-hidden="true">
      <div className="intro-mesh">
        <GeometricMesh className="intro-geo-lines" />
      </div>
      <div className="intro-content">
        <div className="intro-version">PORTFOLIO_V1.0.1</div>
        <div className="intro-logo" aria-label="Hyunwoo Kim">
          <TypingAnimation
            className="intro-logo-text"
            delay={120}
            startOnView={false}
            typeSpeed={72}
          >
            {fullName}
          </TypingAnimation>
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
