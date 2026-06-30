/**
 * Botão reutilizável com três variantes:
 * - "primary"   → ação principal (Calcular, Confirmar)
 * - "secondary" → ação secundária (Comparar, Cancelar)
 * - "ghost"     → ação discreta (links, toggles)
 *
 * Recebe todas as props nativas de <button> via ...props,
 * então onClick, type, disabled, etc. funcionam normalmente.
 */
const VARIANTES = {
  primary: `bg-brand-500 text-white hover:bg-brand-600`,
  secondary: `border border-brand-300 text-brand-600 hover:bg-brand-50
              dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900`,
  ghost: `text-brand-500 hover:underline`,
};

function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
                  ${VARIANTES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
