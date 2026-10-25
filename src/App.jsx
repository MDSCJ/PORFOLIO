import Scene from './components/canvas/Scene'
import Navbar from './components/ui/Navbar'
import Hero from './components/ui/Hero'
import About from './components/ui/About'
import Skills from './components/ui/Skills'
import CursorGrid from './components/ui/CursorGrid'
import Projects from './components/ui/Projects'
import Research from './components/ui/Research'
import Contact from './components/ui/Contact'
import Footer from './components/ui/Footer'

export default function App() {
  return (
    <>
      <Scene />
      <Navbar />
      <main className="relative z-10">
        <CursorGrid />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Research />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
