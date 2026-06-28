import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  // Aqui está a mágica do Context: este componente não recebeu
  // "tema" nem "alternarTema" via props — ele "puxou" do contexto
  // mais próximo na árvore (o <ThemeProvider> que envolve o <App />).
  const { tema, alternarTema } = useTheme();

  const ehDark = tema === 'dark';

  return (
    <button
      onClick={alternarTema}
      aria-label={ehDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="rounded-full p-2 text-brand-500 hover:bg-brand-50
                 dark:text-brand-300 dark:hover:bg-brand-900
                 transition-colors focus-visible:outline focus-visible:outline-2
                 focus-visible:outline-brand-500"
    >
      {ehDark ? (
        // Ícone de sol (mostrado no modo escuro, convidando a voltar pro claro)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Ícone de lua (mostrado no modo claro, convidando a ir pro escuro)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
