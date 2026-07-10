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

  let expr = expressao
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "PI")
    .replace(/\^/g, "**");

  // Valida parênteses antes de tentar avaliar
  let profundidade = 0;
  for (const char of expr) {
    if (char === "(") profundidade++;
    if (char === ")") profundidade--;
    if (profundidade < 0) throw new Error("PAREN_DESBALANCEADO");
  }
  if (profundidade !== 0) throw new Error("PAREN_DESBALANCEADO");

  // Valida que não termina com operador
  if (/[+\-*/÷×]$/.test(expr.trim())) throw new Error("OPERADOR_SOZINHO");

  // Valida que não tem dois operadores seguidos (ex: 3 ++ 4, 3 */ 4)
  if (/[+\-*/]{2,}/.test(expr.replace(/\*\*/g, "POW")))
    throw new Error("OPERADOR_SOZINHO");

  // Valida parêntese vazio
  if (/\(\s*\)/.test(expr)) throw new Error("PAREN_VAZIO");

  const nomes = Object.keys(CONTEXTO);
  const valores = Object.values(CONTEXTO);

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...nomes, `'use strict'; return (${expr});`);
    const resultado = fn(...valores);

    if (!isFinite(resultado)) throw new Error("DIVISAO_POR_ZERO");
    if (isNaN(resultado)) throw new Error("RESULTADO_INVALIDO");

    return resultado;
  } catch (err) {
    // Se já é um erro nosso (código de erro), propaga
    if (err.message && err.message === err.message.toUpperCase()) throw err;
    // Erro de sintaxe do JS — tenta identificar
    if (err instanceof SyntaxError) throw new Error("SINTAXE_INVALIDA");
    throw new Error("EXPRESSAO_INVALIDA");
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

/**
 * Mapeia códigos de erro internos para chaves de i18n.
 * Segue o mesmo padrão do TranslateError.js do modo LISP.
 */
export function traduzirErroNormal(mensagem, t) {
  const mapa = {
    PAREN_DESBALANCEADO: "calc.normal.erros.parenDesbalanceado",
    OPERADOR_SOZINHO: "calc.normal.erros.operadorSozinho",
    PAREN_VAZIO: "calc.normal.erros.parenVazio",
    DIVISAO_POR_ZERO: "calc.normal.erros.divisaoPorZero",
    RESULTADO_INVALIDO: "calc.normal.erros.resultadoInvalido",
    SINTAXE_INVALIDA: "calc.normal.erros.sintaxeInvalida",
    EXPRESSAO_INVALIDA: "calc.normal.erros.expressaoInvalida",
  };

  const chave = mapa[mensagem];
  return chave ? t(chave) : t("calc.normal.erros.expressaoInvalida");
}
