import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import ArchitectureShowcase from './pages/ArchitectureShowcase'
import AIVisualsShowcase from './pages/AIVisualsShowcase'
import WebApplicationsShowcase from './pages/WebApplicationsShowcase'
import WebGamesShowcase from './pages/WebGamesShowcase'
import PrintingShowcase from './pages/PrintingShowcase'

export default function App() {
  const location = useLocation()

  return (
    <>
      <div className="grain" />
      <Cursor />
      <Nav />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Navigate to="/#work" replace />} />
            <Route path="/work/architecture" element={<ArchitectureShowcase />} />
            <Route path="/work/ferris-video" element={<AIVisualsShowcase />} />
            <Route path="/work/web-applications" element={<WebApplicationsShowcase />} />
            <Route path="/work/web-games" element={<WebGamesShowcase />} />
            <Route path="/work/3d-printing" element={<PrintingShowcase />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/contact" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </>
  )
}
