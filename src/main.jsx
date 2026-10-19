import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'
import './styles/landing.css'
import './styles/dashboard.css'
import './styles/upload.css'
import './styles/editor.css'
import './styles/settings.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
