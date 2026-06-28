import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração padrão do Vite para projetos React.
// O plugin "react" habilita o Fast Refresh (atualização instantânea
// no navegador ao salvar um arquivo, sem perder o estado da página).
export default defineConfig({
  plugins: [react()],
});
