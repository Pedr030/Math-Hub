/**
 * Painel de saída em estilo terminal — usado por ferramentas que
 * precisam exibir resultados intermediários (tokens, notações, etc.)
 * em formato monoespaçado.
 *
 * Aceita "rows": um array de objetos { label, value, highlight }
 * onde highlight=true aplica a cor de destaque (brand) no valor.
 */
function OutputPanel({ rows = [], className = "" }) {
  if (!rows.length) return null;

  return (
    <div
      className={`mt-4 space-y-1.5 rounded-lg bg-slate-50 p-4 font-mono text-sm
                  dark:bg-brand-950/60 ${className}`}
    >
      {rows.map(({ label, value, highlight, large }) => (
        <p key={label}>
          <span className="text-slate-400">{label}:</span>{" "}
          <span
            className={
              large
                ? "text-lg font-semibold text-brand-600 dark:text-brand-300"
                : highlight
                  ? "font-medium text-brand-500"
                  : "text-slate-700 dark:text-slate-300"
            }
          >
            {value}
          </span>
        </p>
      ))}
    </div>
  );
}

export default OutputPanel;
