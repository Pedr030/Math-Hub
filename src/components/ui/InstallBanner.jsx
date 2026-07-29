import { useTranslation } from 'react-i18next';
import { useInstallPWA } from '../../hooks/useInstallPWA';

/**
 * Banner de instalação — aparece só quando o browser sinaliza que
 * o app é elegível pra instalação (evento beforeinstallprompt).
 * Em iOS Safari, onde esse evento não existe, o banner não aparece
 * (o usuário instala pelo menu "Adicionar à Tela de Início").
 */
function InstallBanner() {
  const { t } = useTranslation();
  const { podeInstalar, instalar } = useInstallPWA();

  if (!podeInstalar) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200
                      bg-white px-4 py-3 shadow-lg dark:border-brand-700 dark:bg-brand-900">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📲</span>
          <div>
            <p className="font-display font-semibold text-sm">
              {t('pwa.banner.titulo')}
            </p>
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {t('pwa.banner.desc')}
            </p>
          </div>
        </div>
        <button
          onClick={instalar}
          className="shrink-0 rounded-lg bg-brand-500 px-3 py-1.5 font-mono text-xs
                     font-medium text-white hover:bg-brand-600 transition-colors"
        >
          {t('pwa.banner.instalar')}
        </button>
      </div>
    </div>
  );
}

export default InstallBanner;