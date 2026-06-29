import { ComplexNumber } from './complexNumber';

const FUNCOES = new Set(['conj', 'raiz']);
const BINARIOS = new Set(['+', '-', '*', '/', '**']);

function validarOperandos(op, a, b) {
  if (BINARIOS.has(op) && (a == null || b == null)) {
    throw new Error('Operandos inválidos');
  }
  if (FUNCOES.has(op) && a == null) {
    throw new Error('Operando inválido');
  }
}

/**
 * Percorre a árvore recursivamente e calcula o resultado final.
 * Port direto de Avaliador.avaliar em evaluator.py.
 */
export function avaliar(no, variaveis) {
  if (no == null || !('valor' in no)) {
    throw new Error('Nó inválido');
  }

  // Caso 1: é um número (folha da árvore)
  try {
    return ComplexNumber.fromString(String(no.valor));
  } catch {
    // não é um número — continua tentando os outros casos
  }

  // Caso 2: é uma variável (folha da árvore)
  if (/^[a-zA-Z]+$/.test(no.valor) && !FUNCOES.has(no.valor)) {
    if (!(no.valor in variaveis)) {
      throw new Error(`Variável '${no.valor}' não definida`);
    }
    return variaveis[no.valor];
  }

  // Caso 3: é um operador ou função (nó interno) — calcula os filhos primeiro
  const a = no.esquerda ? avaliar(no.esquerda, variaveis) : null;
  const b = no.direita ? avaliar(no.direita, variaveis) : null;

  const op = no.valor;
  validarOperandos(op, a, b);

  switch (op) {
    case '+':
      return a.somar(b);
    case '-':
      return a.subtrair(b);
    case '*':
      return a.multiplicar(b);
    case '/':
      return a.dividir(b);
    case '**':
      // Potência só aceita expoente real
      return a.potencia(typeof b.real === 'number' ? b.real : b);
    case 'conj':
      return a.conjugado();
    case 'raiz':
      return a.raizQuadrada();
    default:
      throw new Error(`Operador desconhecido: ${op}`);
  }
}
