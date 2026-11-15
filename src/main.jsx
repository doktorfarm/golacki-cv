import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
// Production HTML is prerendered (scripts/prerender.mjs) → hydrate; dev server starts empty → render.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
