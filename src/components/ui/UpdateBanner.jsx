import { useTranslation } from 'react-i18next';
import { useUpdatePWA } from '../../hooks/useUpdatePWA';

/**
 * Banner que aparece quando uma nova versão do app já foi baixada
 * em segundo plano e está pronta pra assumir. Diferente do banner
 * de instalação, não persiste a dispensa em localStorage — se o
 * usuário fechar sem atualizar, o app ainda vai rodar a versão
 * antiga até o próximo reload manual.
 */
function UpdateBanner() {
  const { t } = useTranslation();
  const { needRefresh, atualizar, dispensar } = useUpdatePWA();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 shadow-lg dark:border-brand-700 dark:bg-brand-900">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔄</span>
          <div>
            <p className="font-display font-semibold text-sm">
              {t('pwa.atualizar.titulo')}
            </p>
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {t('pwa.atualizar.desc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={atualizar}
            className="shrink-0 rounded-lg bg-brand-500 px-3 py-1.5 font-mono text-xs font-medium text-white transition-colors hover:bg-brand-600"
          >
            {t('pwa.atualizar.botao')}
          </button>

          <button
            onClick={dispensar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Fechar banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateBanner;
