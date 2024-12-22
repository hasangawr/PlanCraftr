import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { EmailProvider } from './contexts/EmailProvider.tsx';
import { ThemeProvider } from '@mui/material';
import mainTheme from './themes/MainTheme.ts';
import AuthProvider from './contexts/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={mainTheme}>
    <AuthProvider>
      <EmailProvider>
        <App />
      </EmailProvider>
    </AuthProvider>
  </ThemeProvider>,
);
