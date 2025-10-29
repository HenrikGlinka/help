import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { LoginProvider } from './contexts/login-context.jsx';
import { AlertProvider } from './contexts/alert-context.jsx';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </LoginProvider>
    </BrowserRouter>
  </StrictMode>,
)
