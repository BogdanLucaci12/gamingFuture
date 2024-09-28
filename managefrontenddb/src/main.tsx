import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { RegenerateProvider } from './context/regenerate.context.tsx'
import { OverlayProvider } from './context/activateOverlay.context.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <OverlayProvider>
      <RegenerateProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </RegenerateProvider>
      </OverlayProvider>
    </Provider>
  </StrictMode>,
)
