import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { clearLegacyBrowserCaches } from './lib/browser-cache'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

clearLegacyBrowserCaches()

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
