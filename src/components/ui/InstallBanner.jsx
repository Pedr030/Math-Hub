import { useState } from 'react'; // 1. Importar o useState
import { useTranslation } from 'react-i18next';
import { useInstallPWA } from '../../hooks/useInstallPWA';

/**
 * Banner de instalação - aparece só quando o browser sinaliza que
 * o app é elegível pra instalação (evento beforeinstallprompt).
 * Em iOS Safari, onde esse evento não existe, o banner não aparece
 * (o usuário instala pelo menu "Adicionar à Tela de Início").
 */
function InstallBanner() {
  const { t } = useTranslation();
  const { podeInstalar, instalar } = useInstallPWA();
  
  // 2. Criar o estado para controlar a visibilidade do banner
  // Lê do localStorage pra saber se já foi fechado antes
  const [visivel, setVisivel] = useState(() => {
    return localStorage.getItem('bannerPwaOculto') !== 'true';
  });

  const fecharBanner = () => {
    setVisivel(false);
    localStorage.setItem('bannerPwaOculto', 'true'); // Salva a decisão
  };

  // 3. Adicionar a verificação do estado na condição de retorno
  if (!podeInstalar || !visivel) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 shadow-lg dark:border-brand-700 dark:bg-brand-900">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📲</span>
          <div>
            <p className="font-display font-semibold text-sm">
              {t('pwa.banner.titulo')}
            </p>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {t('pwa.banner.desc')}
            </p>
          </div>
        </div>
        
        {/* 4. Criar uma div para agrupar o botão de instalar e o de fechar */}
        <div className="flex items-center gap-1">
          <button
            onClick={instalar}
            className="shrink-0 rounded-lg bg-brand-500 px-3 py-1.5 font-mono text-xs font-medium text-white transition-colors hover:bg-brand-600"
          >
            {t('pwa.banner.instalar')}
          </button>
          
          {/* 5. Botão de Fechar com um ícone de 'X' em SVG */}
          <button
            onClick={fecharBanner}
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

export default InstallBanner;