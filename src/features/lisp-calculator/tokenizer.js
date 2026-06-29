/**
 * Quebra uma expressão em tokens (pedaços): números, operadores,
 * parênteses, variáveis e nomes de função.
 * Port direto de tokenizer.py.
 */

function processarNumero(expressao, posInicial, charInicial = '') {
  // Lê um número completo (pode ser complexo como 3.5j)
  let numero = charInicial;
  let i = posInicial;
  let temPonto = charInicial === '.';
  let temJ = false;

  while (
    i < expressao.length &&
    (/\d/.test(expressao[i]) ||
      (expressao[i] === '.' && !temPonto) ||
      (expressao[i] === 'j' && !temJ))
  ) {
    if (expressao[i] === '.') temPonto = true; // só permite um ponto
    if (expressao[i] === 'j') temJ = true; // só permite um 'j'
    numero += expressao[i];
    i += 1;
  }

  return [numero, i];
}

export function tokenizar(expressao) {
  const tokens = [];
  let i = 0;

  while (i < expressao.length) {
    const char = expressao[i];

    // Pula espaços em branco
    if (/\s/.test(char)) {
      i += 1;
      continue;
    }

    // Operador de potência ** (tem que vir antes do * simples)
    if (expressao.slice(i, i + 2) === '**') {
      tokens.push('**');
      i += 2;
      continue;
    }

    // Números negativos (como -5 ou -3.2j) — só conta como sinal de número
    // se vier no começo da expressão, ou logo depois de outro operador/parêntese
    const ultimoToken = tokens[tokens.length - 1];
    const podeSerSinal =
      tokens.length === 0 || '(+-*/)'.includes(ultimoToken) || ultimoToken === '**';
    const proximoExiste = i + 1 < expressao.length;
    const proximoEhDigito = proximoExiste && (/\d/.test(expressao[i + 1]) || expressao[i + 1] === '.');

    if ('+-'.includes(char) && podeSerSinal && proximoEhDigito) {
      const [num, novoI] = processarNumero(expressao, i + 1, char);
      tokens.push(num);
      i = novoI;
      continue;
    }

    // Operadores e parênteses
    if ('+-*/()'.includes(char)) {
      tokens.push(char);
      i += 1;
      continue;
    }

    // Números (reais ou complexos)
    if (/\d/.test(char) || char === '.') {
      const [num, novoI] = processarNumero(expressao, i + 1, char);
      tokens.push(num);
      i = novoI;
      continue;
    }

    // Variáveis e funções (a, b, conj, raiz, etc)
    if (/[a-zA-Z]/.test(char)) {
      let nome = char;
      i += 1;
      while (i < expressao.length && /[a-zA-Z0-9]/.test(expressao[i])) {
        nome += expressao[i];
        i += 1;
      }
      tokens.push(nome);
      continue;
    }

    // Se chegou aqui, é um caractere que não reconhecemos
    throw new Error(`Token inválido na posição ${i}: ${char}`);
  }

  return tokens;
}
