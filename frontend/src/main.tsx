import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { EmailProvider } from './contexts/EmailProvider.tsx';
import { ThemeProvider } from '@mui/material';
import mainTheme from './themes/MainTheme.ts';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={mainTheme}>
    <EmailProvider>
      <App />
    </EmailProvider>
  </ThemeProvider>,
);
