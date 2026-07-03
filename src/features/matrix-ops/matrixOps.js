/**
 * Operações com matrizes 2x2 e 3x3.
 * Funções puras — sem dependência de React ou UI.
 */

export function criarMatrizVazia(tamanho) {
  return Array.from({ length: tamanho }, () => Array(tamanho).fill(""));
}

export function parseMatriz(matriz) {
  return matriz.map((linha) =>
    linha.map((v) => {
      const n = Number(v);
      if (v.trim() === "" || isNaN(n))
        throw new Error(`Valor inválido: "${v}"`);
      return n;
    }),
  );
}

export function somar(a, b) {
  return a.map((linha, i) => linha.map((v, j) => v + b[i][j]));
}

export function subtrair(a, b) {
  return a.map((linha, i) => linha.map((v, j) => v - b[i][j]));
}

export function multiplicar(a, b) {
  const n = a.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (__, j) =>
      a[i].reduce((soma, _, k) => soma + a[i][k] * b[k][j], 0),
    ),
  );
}

export function transposta(a) {
  return a[0].map((_, j) => a.map((linha) => linha[j]));
}

export function determinante2x2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

export function determinante3x3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

export function determinante(m) {
  return m.length === 2 ? determinante2x2(m) : determinante3x3(m);
}

// Formata um número da matriz: inteiro sem decimais, float com até 4 casas
export function fmt(n) {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(4)).toString();
}
