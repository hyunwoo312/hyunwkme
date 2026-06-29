import './styles/index.css'
import { BackgroundMesh } from './components/BackgroundMesh'
import { CyreneCorner } from './components/CyreneCorner'
import { ExperienceTimeline } from './components/ExperienceTimeline'
import { FloatingNav } from './components/FloatingNav'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { IntroScreen } from './components/IntroScreen'
import { Projects } from './components/Projects'
import { Symbols } from './components/Symbols'

function App() {
  return (
    <>
      <IntroScreen />
      <Symbols />
      <BackgroundMesh />
      <FloatingNav />
      <main>
        <Hero />
        <Projects />
        <ExperienceTimeline />
      </main>
      <CyreneCorner />
      <Footer />
    </>
  )
}

export default App
