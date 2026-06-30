/**
 * Card container padrão de cada ferramenta do Hub.
 * Toda feature nova deve usar esse wrapper em vez de
 * repetir as classes de borda/sombra/fundo manualmente.
 */
function ToolCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-brand-100 bg-white p-6 shadow-sm
                  dark:border-brand-900 dark:bg-brand-900/30 ${className}`}
    >
      {children}
    </div>
  );
}

export default ToolCard;
