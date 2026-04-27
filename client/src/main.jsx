import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { registerPwaServiceWorker } from './utils/pwa'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const isGoogleConfigured =
  googleClientId && !googleClientId.includes('your-google-client-id');

registerPwaServiceWorker();

const appTree = (
  <EventProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </EventProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isGoogleConfigured ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {appTree}
      </GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </React.StrictMode>,
)
