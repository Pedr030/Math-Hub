import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Hook que expõe quando uma nova versão do Service Worker já foi
 * baixada e está esperando pra assumir (registerType: 'autoUpdate'
 * ativa o SW novo sozinho, mas a aba já aberta só passa a rodar o
 * código novo depois de um reload — é isso que este hook dispara).
 */
export function useUpdatePWA() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // reforça a checagem por atualização enquanto o app fica aberto
      setInterval(() => registration.update(), 60 * 60 * 1000);
    },
  });

  function atualizar() {
    updateServiceWorker(true);
  }

  function dispensar() {
    setNeedRefresh(false);
  }

  return { needRefresh, atualizar, dispensar };
}
