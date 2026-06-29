import { ComplexNumber } from './complexNumber';

// Define a ordem de prioridade dos operadores (maior número = maior prioridade)
const PRECEDENCIA = {
  '+': 1,
  '-': 1, // soma e subtração têm menor prioridade
  '*': 2,
  '/': 2, // multiplicação e divisão têm prioridade média
  '**': 3, // potência tem maior prioridade
};

const FUNCOES = ['conj', 'raiz'];

export function ehNumero(token) {
  if (typeof token !== 'string') return false;

  // Só aceita caracteres válidos para números
  const charsValidos = new Set('0123456789.+-j');
  if (![...token].every((c) => charsValidos.has(c))) return false;

  // Tenta converter pra ver se é um número válido
  try {
    ComplexNumber.fromString(token);
    return true;
  } catch {
    return false;
  }
}

export function ehFuncao(token) {
  return FUNCOES.includes(token);
}

export function ehVariavel(token) {
  if (typeof token !== 'string' || !token) return false;
  if (!/[a-zA-Z]/.test(token[0])) return false; // tem que começar com letra
  if (!/^[a-zA-Z0-9_]+$/.test(token)) return false; // só letras, números e _
  return !ehFuncao(token);
}

/**
 * Converte expressão infixa (tokens) para notação pós-fixa,
 * usando o algoritmo Shunting Yard.
 */
export function paraPosfixa(tokens) {
  const saida = []; // lista final com a expressão em pós-fixa
  const pilha = []; // pilha temporária para operadores

  for (const t of tokens) {
    // Números e variáveis vão direto pra saída
    if (ehNumero(t) || ehVariavel(t)) {
      saida.push(t);

      // Operadores: respeitam a precedência
    } else if (t in PRECEDENCIA) {
      while (
        pilha.length &&
        pilha[pilha.length - 1] in PRECEDENCIA &&
        PRECEDENCIA[pilha[pilha.length - 1]] > PRECEDENCIA[t]
      ) {
        saida.push(pilha.pop());
      }
      pilha.push(t);

      // Parêntese que abre: vai pra pilha
    } else if (t === '(') {
      pilha.push(t);

      // Parêntese que fecha: processa tudo até o que abre
    } else if (t === ')') {
      while (pilha.length && pilha[pilha.length - 1] !== '(') {
        saida.push(pilha.pop());
      }
      if (!pilha.length) throw new Error('Parênteses desbalanceados');
      pilha.pop(); // remove o "("

      // Se tem função esperando, processa ela agora
      if (pilha.length && ehFuncao(pilha[pilha.length - 1])) {
        saida.push(pilha.pop());
      }

      // Funções: vão pra pilha e esperam seus argumentos
    } else if (ehFuncao(t)) {
      pilha.push(t);
    } else {
      throw new Error(`Símbolo inesperado: ${t}`);
    }
  }

  // Esvazia a pilha no final
  while (pilha.length) {
    const topo = pilha.pop();
    if (topo === '(') throw new Error('Parênteses desbalanceados');
    saida.push(topo);
  }

  return saida;
}

/**
 * Varre os tokens e devolve os nomes de variáveis encontrados, na ordem
 * em que aparecem (sem repetir). Não existe no Python original — lá,
 * isso era feito direto no loop que chamava input(). Aqui precisamos
 * saber ANTES de calcular, pra desenhar os campos na tela.
 *
 * Nota: o loop equivalente em operacoes.py tinha um bug sutil — ele
 * checava só "é letra e não é função?", sem checar se o token já era
 * um número válido. Isso fazia o "j" solto (ex: em "4-j", a unidade
 * imaginária) ser tratado como variável precisando de valor, quando
 * na verdade já é o número (0+1j). Aqui excluímos explicitamente
 * qualquer token que ehNumero() já reconheça.
 */
export function extrairVariaveis(tokens) {
  const vistas = new Set();
  const variaveis = [];

  for (const t of tokens) {
    if (ehVariavel(t) && !ehNumero(t) && !vistas.has(t)) {
      vistas.add(t);
      variaveis.push(t);
    }
  }

  return variaveis;
}
