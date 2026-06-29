import { useEffect } from "react";

/**
 * Modal genérico, reutilizável por qualquer ferramenta do Hub.
 * Recebe o controle de "está aberto ou não" de fora (isOpen + onClose) —
 * esse padrão se chama "componente controlado": o Modal não decide por
 * si só quando aparece, quem usa ele é quem decide, via useState.
 */
function Modal({ isOpen, onClose, title, children }) {
  // Fecha com a tecla ESC — boa prática de acessibilidade.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    // Função de "limpeza": remove o listener quando o modal fecha ou
    // o componente desmonta. Sem isso, listeners se acumulariam a
    // cada vez que o modal abrisse.
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose} // clique no overlay (fora do card) fecha o modal
    >
      <div
        onClick={(e) => e.stopPropagation()} // impede que clique DENTRO do card propague e feche
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl
                   dark:bg-brand-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600
                       dark:hover:bg-brand-800 dark:hover:text-slate-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
