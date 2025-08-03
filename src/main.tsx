
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./lib/queryClientProvider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './components/ui/toaster';
import { initSecurityMonitoring } from './lib/security';
import App from './App';
import './index.css';

// Initialize security monitoring
initSecurityMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" attribute="class">
        <QueryProvider>
          <App />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

