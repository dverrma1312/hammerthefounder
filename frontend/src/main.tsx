import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/hammerthefounder')) {
    return '/hammerthefounder'
  }
  return ''
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
