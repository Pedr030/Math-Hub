/**
 * Input de texto reutilizável — sempre em font-mono,
 * porque no Math Hub todo campo de entrada é uma expressão matemática.
 */
function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex-1 rounded-lg border border-brand-100 bg-white px-3 py-2
                  font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-400
                  dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100
                  ${className}`}
      {...props}
    />
  );
}

export default Input;
