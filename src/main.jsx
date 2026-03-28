import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
/* Active Design System: Sovereign Glass (Sovereign Layout + Glassmorphism Colors) */
import './sovereign-glass.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
