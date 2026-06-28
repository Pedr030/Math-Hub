import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

// createRoot conecta o React à div#root do index.html.
// StrictMode é um "modo de desenvolvimento" que ajuda a detectar
// problemas comuns (não afeta a versão final em produção).
// ThemeProvider envolve o App para que QUALQUER componente da árvore
// (Header, futuros cards, futuras ferramentas) possa chamar useTheme()
// sem precisar receber o tema via props.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
