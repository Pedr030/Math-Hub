import { useTranslation } from 'react-i18next'; // 1. Importar o hook de tradução

function Footer({ aoAbrirFeedback }) {
  const { t } = useTranslation(); // 2. Instanciar a função de tradução

  return (
    <footer className="mt-12 border-t border-brand-100 dark:border-brand-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
          math-hub • v0.1.0
        </p>

        <div className="flex items-center gap-4">
          
          {/* Botão atualizado: Trocamos o texto pelo ícone SVG e adicionamos title/aria-label traduzidos */}
          <button
            onClick={aoAbrirFeedback}
            aria-label={t('feedback.tooltip')}
            title={t('feedback.tooltip')}
            className="text-slate-400 transition-colors hover:text-brand-500 dark:text-slate-500 dark:hover:text-brand-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 2 1.88 1.88"/>
              <path d="M14.12 3.88 16 2"/>
              <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
              <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
              <path d="M12 20v-9"/>
              <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
              <path d="M17.47 9c1.93-.2 3.53-1.9 3.53-4"/>
              <path d="M8 11H5.5c-1.4 0-2.5 1.1-2.5 2.5v0c0 1.4 1.1 2.5 2.5 2.5H8"/>
              <path d="M16 11h2.5c1.4 0 2.5 1.1 2.5 2.5v0c0 1.4-1.1 2.5-2.5 2.5H16"/>
            </svg>
          </button>

          <a
            href="https://github.com/Pedr030"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil no GitHub"
            title="Perfil no GitHub"
            className="text-slate-400 hover:text-brand-500 dark:text-slate-500 dark:hover:text-brand-300 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;