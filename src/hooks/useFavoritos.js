import { useState, useEffect } from "react";

const CHAVE = "math-hub-favoritos";

/**
 * Hook que gerencia favoritos com persistência em localStorage.
 * Retorna os IDs favoritos e funções pra adicionar/remover/verificar.
 */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(favoritos));
    } catch {}
  }, [favoritos]);

  function alternarFavorito(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  function ehFavorito(id) {
    return favoritos.includes(id);
  }

  return { favoritos, alternarFavorito, ehFavorito };
}
