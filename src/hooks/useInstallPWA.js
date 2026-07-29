import { useState, useEffect } from 'react';

/**
 * Hook que captura o evento de instalação do PWA.
 * O browser dispara 'beforeinstallprompt' quando o app é elegível
 * pra instalação mas ainda não foi instalado. Guardamos o evento
 * pra chamar .prompt() quando o usuário clicar no botão.
 */
export function useInstallPWA() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    function handleBeforeInstall(e) {
      e.preventDefault(); // impede o mini-infobar automático do Chrome
      setPromptEvent(e);  // guarda pra usar quando quisermos
    }

    function handleInstalled() {
      setInstalado(true);
      setPromptEvent(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function instalar() {
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') setInstalado(true);
    setPromptEvent(null);
  }

  const podeInstalar = Boolean(promptEvent) && !instalado;

  return { podeInstalar, instalar, instalado };
}