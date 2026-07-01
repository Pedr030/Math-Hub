import { useEffect } from "react";

/**
 * Atualiza o <title> da aba do navegador de forma declarativa.
 * Quando o componente desmonta, restaura o título padrão do Hub.
 */
export function useDocumentTitle(titulo) {
  useEffect(() => {
    const tituloPadrao = "Math Hub";
    document.title = titulo ? `${titulo} — Math Hub` : tituloPadrao;

    // Restaura ao sair da página
    return () => {
      document.title = tituloPadrao;
    };
  }, [titulo]);
}
