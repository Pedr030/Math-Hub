/**
 * Percorre a árvore e gera a representação em notação LISP.
 * Port direto de ConversorLisp.to_lisp em lisp.py.
 *
 * Esse é o coração "conceitual" do produto: toda expressão matemática
 * em notação infixa tem uma forma equivalente em notação prefixa (LISP),
 * onde o operador vem ANTES dos operandos: (+ 3 4) em vez de 3 + 4.
 */
export function paraLisp(no) {
  if (no == null) return '';

  if (no.valor == null) {
    throw new Error("Nó deve ter atributo 'valor'");
  }

  // Folha da árvore (número ou variável) — sem filhos
  if (no.esquerda == null && no.direita == null) {
    return String(no.valor);
  }

  // Função unária (só tem filho à esquerda): (conj 3+4j)
  if (no.direita == null) {
    return `(${no.valor} ${paraLisp(no.esquerda)})`;
  }

  // Operador binário (tem dois filhos): (+ 3 4)
  return `(${no.valor} ${paraLisp(no.esquerda)} ${paraLisp(no.direita)})`;
}
