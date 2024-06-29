import { RouterProvider } from 'react-router-dom';
import './global.css';
import { router } from './routes';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { Provider } from 'react-redux';
import { store } from './reducers/store';

export function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark" storageKey="pa3-theme">
          <Helmet titleTemplate="Pousada quinta do Ypuã" />

          <Toaster richColors />

          <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  )
}