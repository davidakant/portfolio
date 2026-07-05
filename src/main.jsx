import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.jsx'

// Standalone builds (npm run build:standalone) are opened directly via file://
// (double-clicked), where the History API BrowserRouter needs doesn't work
// reliably. HashRouter (#/work instead of /work) works from a local file too.
const Router = import.meta.env.MODE === 'standalone' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
