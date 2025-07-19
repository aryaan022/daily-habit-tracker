/**
 * Application Entry Point
 * 
 * WHY: Wraps the app with authentication context for global auth state
 * WHAT: Renders the app with AuthProvider for user authentication
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
