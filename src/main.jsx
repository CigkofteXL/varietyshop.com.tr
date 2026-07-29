import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './pages/tools/ErrorBoundary.jsx';
import { NotificationProvider } from './pages/tools/NotificationContext';
import { CartProvider } from './pages/tools/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter> 
      <CartProvider> {/* SEPET SİSTEMİ DEVREDE */}
        {/* Bildirim sistemi tüm rotalara hakim olsun diye burada */}
        <NotificationProvider>
          <App />
        </NotificationProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)