const FUNCOES = ['conj', 'raiz'];
const OPERADORES = ['+', '-', '*', '/', '**'];

/**
 * Representa um nó da árvore (pode ser número, variável, operador ou função).
 * Port direto da classe No em arvore.py.
 */
export class No {
  constructor(valor, esquerda = null, direita = null) {
    this.valor = valor; // o que está neste nó (número, +, -, conj, etc)
    this.esquerda = esquerda; // filho da esquerda
    this.direita = direita; // filho da direita
  }
}

function ehFuncao(token) {
  return FUNCOES.includes(token);
}

/**
 * Monta a árvore da expressão a partir da notação pós-fixa.
 * Mesmo algoritmo de pilha do arvore.py.
 */
export function criarDePosfixa(posfixa) {
  const pilha = []; // pilha de nós da árvore

  for (const token of posfixa) {
    // Funções (conj, raiz) — pegam um operando
    if (ehFuncao(token)) {
      if (!pilha.length) throw new Error('Expressão malformada: função sem operando');
      const filho = pilha.pop();
      pilha.push(new No(token, filho)); // função fica na raiz, operando à esquerda

      // Números e variáveis — viram folhas da árvore
    } else if (!OPERADORES.includes(token)) {
      pilha.push(new No(token)); // nó sem filhos

      // Operadores (+, -, *, /, **) — pegam dois operandos
    } else if (OPERADORES.includes(token)) {
      if (pilha.length < 2) {
        throw new Error('Expressão malformada: operador sem operandos suficientes');
      }
      // Em pós-fixa, o último é o da direita
      const direita = pilha.pop();
      const esquerda = pilha.pop();
      pilha.push(new No(token, esquerda, direita)); // operador na raiz
    } else {
      throw new Error(`Token desconhecido: ${token}`);
    }
  }

  // No final deve sobrar exatamente um nó (a raiz da árvore)
  if (pilha.length !== 1) {
    throw new Error('Expressão malformada: resultado inválido');
  }

  return pilha[0];
}
