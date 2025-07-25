import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './App.tsx'
import './index.css'
import { ToastProvider } from './components/ui/toast.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <Root />
    </ToastProvider>
  </React.StrictMode>,
)
