import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginDemo from './LoginDemo.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginDemo />
  </StrictMode>,
)
