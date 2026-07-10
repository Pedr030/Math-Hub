/**
 * Avaliador de expressões matemáticas simples para o modo normal.
 * Usa o objeto Math do JavaScript diretamente — sem necessidade do
 * pipeline LISP, já que trabalhamos só com números reais aqui.
 */

// Constantes e funções permitidas — lista explícita por segurança
// (evita expor eval() sem restrições)
const CONTEXTO = {
  sin: (x) => Math.sin((x * Math.PI) / 180), // graus, não radianos
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  asin: (x) => (Math.asin(x) * 180) / Math.PI,
  acos: (x) => (Math.acos(x) * 180) / Math.PI,
  atan: (x) => (Math.atan(x) * 180) / Math.PI,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  PI: Math.PI,
  E: Math.E,
};

/**
 * Substitui tokens conhecidos e avalia a expressão com segurança.
 * Não usa eval() global — usa Function() com contexto restrito.
 */
export function avaliarExpressao(expressao) {
  if (!expressao || expressao.trim() === "") return null;

  // Substitui × e ÷ pelos operadores JS equivalentes
  let expr = expressao
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "PI")
    .replace(/\^/g, "**");

  // Monta os argumentos da função com as constantes e funções do contexto
  const nomes = Object.keys(CONTEXTO);
  const valores = Object.values(CONTEXTO);

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...nomes, `'use strict'; return (${expr});`);
    const resultado = fn(...valores);

    if (!isFinite(resultado)) throw new Error("Resultado indefinido");
    if (isNaN(resultado)) throw new Error("Resultado inválido");

    return resultado;
  } catch {
    throw new Error("Expressão inválida");
  }
}

export function fmtNormal(n) {
  if (n === null || n === undefined) return "";
  if (Number.isInteger(n)) return String(n);

  // Evita notação científica desnecessária pra números "comuns"
  const abs = Math.abs(n);
  if (abs >= 0.0001 && abs < 1e10) {
    return parseFloat(n.toPrecision(10)).toString();
  }
  return n.toExponential(6);
}
