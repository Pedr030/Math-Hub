/**
 * Compara duas árvores de expressão para ver se são estruturalmente
 * iguais (mesma estrutura/operadores, não o mesmo resultado numérico).
 * Port direto de Comparador.equal em compare.py.
 */
export function arvoresIguais(a, b, profundidade = 0) {
  if (profundidade > 1000) return false; // evita recursão infinita

  if (a == null && b == null) return true;
  if (a == null || b == null) return false;

  if (a.valor !== b.valor) return false;

  return (
    arvoresIguais(a.esquerda, b.esquerda, profundidade + 1) &&
    arvoresIguais(a.direita, b.direita, profundidade + 1)
  );
}
