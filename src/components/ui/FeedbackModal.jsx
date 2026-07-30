import { useState } from 'react';
import Modal from '../ui/Modal';
import { useTranslation } from 'react-i18next'; // Importar o hook de tradução
// Nota: Se preferir, pode importar os seus próprios componentes '../ui/Input' e '../ui/Button' 
// em vez de usar as tags HTML normais, caso os tenha preparado para formulários.

function FeedbackModal({ isOpen, onClose }) {
  const { t } = useTranslation(); // Instanciar a função de tradução
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Recolhe todos os dados dos inputs do formulário
    const formData = new FormData(e.target);

    try {
      // Substitua pela URL que o Formspree lhe deu no Passo 1
      const response = await fetch('https://formspree.io/f/xlgqvalg', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        e.target.reset(); // Limpa o formulário
        
        // Opcional: fechar o modal automaticamente após 3 segundos
        // setTimeout(() => { onClose(); setStatus('idle'); }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  // Se o modal for fechado, resetamos o status para a próxima vez que abrir
  const handleClose = () => {
    setStatus('idle');
    onClose();
  };

 return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('feedback.titulo')}>
      {status === 'success' ? (
        <div className="py-6 text-center">
          <p className="mb-2 text-2xl">🎉</p>
          <p className="mb-1 font-semibold text-brand-500 dark:text-brand-400">{t('feedback.sucessoTitulo')}</p>
          <p className="text-sm">{t('feedback.sucessoDesc')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">{t('feedback.nome')}</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:focus:border-brand-500"
              placeholder={t('feedback.nomePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">{t('feedback.email')}</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:focus:border-brand-500"
              placeholder={t('feedback.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">{t('feedback.mensagem')}</label>
            <textarea
              name="message"
              id="message"
              required
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:focus:border-brand-500"
              placeholder={t('feedback.mensagemPlaceholder')}
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-500">{t('feedback.erro')}</p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t('feedback.cancelar')}
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex min-w-[120px] items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-70"
            >
              {status === 'loading' ? t('feedback.enviando') : t('feedback.enviar')}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default FeedbackModal;