import { useEffect, useId, useRef } from "react";

/**
 * Modal genérico, reutilizável por qualquer ferramenta do Hub.
 * Recebe o controle de "está aberto ou não" de fora (isOpen + onClose) —
 * esse padrão se chama "componente controlado": o Modal não decide por
 * si só quando aparece, quem usa ele é quem decide, via useState.
 */
function Modal({ isOpen, onClose, title, children }) {
  const tituloId = useId();
  const dialogRef = useRef(null);
  const elementoAnteriorRef = useRef(null);

  // Fecha com ESC, prende o Tab dentro do modal, move o foco pra dentro
  // ao abrir e devolve pro elemento que abriu o modal ao fechar.
  useEffect(() => {
    if (!isOpen) return;

    elementoAnteriorRef.current = document.activeElement;
    dialogRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focaveis = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focaveis || focaveis.length === 0) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    // Função de "limpeza": remove o listener e restaura o foco quando
    // o modal fecha ou o componente desmonta.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      elementoAnteriorRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose} // clique no overlay (fora do card) fecha o modal
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()} // impede que clique DENTRO do card propague e feche
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl
                   dark:bg-brand-900 focus:outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 id={tituloId} className="font-display text-lg font-semibold">{title}</h3>
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
