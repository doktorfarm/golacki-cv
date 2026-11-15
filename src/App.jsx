import { useCallback, useEffect } from 'react'
import About from './components/About'
import Backdrop from './components/Backdrop'
import Chrome from './components/Chrome'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Manifest from './components/Manifest'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import Projects from './components/Projects'
import { startSmoothScroll } from './lib/motion'

export default function App() {
  useEffect(() => {
    window.__app = true // tells public/pre.js the bundle booted
    return startSmoothScroll()
  }, [])

  // The intro curtain lifts → drop `pre` so the headline lines rise behind it.
  const release = useCallback(() => document.documentElement.classList.remove('pre'), [])

  return (
    <>
      <a href="#projekty" className="skip">Przejdź do treści</a>
      <Backdrop />
      <Intro onDone={release} />
      <Chrome />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Manifest />
        <Projects />
        <About />
        <Faq />
        <Contact />
      </main>
    </>
  )
}
