import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { EmailProvider } from './contexts/EmailProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <EmailProvider>
    <App />
  </EmailProvider>,
);
