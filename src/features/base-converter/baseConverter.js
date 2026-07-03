/**
 * Conversão entre bases numéricas.
 * Funções puras — sem dependência de React ou UI.
 */

export const BASES = [
  { base: 2, prefixo: "0b", nome: "Binário", digitos: "0-1" },
  { base: 8, prefixo: "0o", nome: "Octal", digitos: "0-7" },
  { base: 10, prefixo: "", nome: "Decimal", digitos: "0-9" },
  { base: 16, prefixo: "0x", nome: "Hexadecimal", digitos: "0-9, A-F" },
];

/**
 * Valida se uma string é um número válido na base informada.
 */
export function ehValido(valor, base) {
  if (!valor || valor.trim() === "") return false;
  const limpo = valor.trim().toUpperCase();
  const chars = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9A-F]+$/,
  };
  return chars[base]?.test(limpo) ?? false;
}

/**
 * Converte um número de qualquer base para todas as outras.
 * Retorna um objeto { 2, 8, 10, 16 } com os valores como string.
 */
export function converterParaTodas(valor, baseOrigem) {
  const limpo = valor.trim().toUpperCase();
  const decimal = parseInt(limpo, baseOrigem);

  if (isNaN(decimal) || decimal < 0) {
    throw new Error(`Valor inválido para base ${baseOrigem}: "${valor}"`);
  }

  return {
    2: decimal.toString(2).toUpperCase(),
    8: decimal.toString(8).toUpperCase(),
    10: decimal.toString(10),
    16: decimal.toString(16).toUpperCase(),
  };
}

/**
 * Retorna os passos da conversão decimal → base destino
 * usando divisões sucessivas (algoritmo clássico de ensino).
 */
export function passosConversao(decimal, baseDestino) {
  if (baseDestino === 10) return [];
  if (decimal === 0) return [{ dividendo: 0, quociente: 0, resto: 0 }];

  const passos = [];
  let n = decimal;

  while (n > 0) {
    passos.push({
      dividendo: n,
      quociente: Math.floor(n / baseDestino),
      resto: n % baseDestino,
    });
    n = Math.floor(n / baseDestino);
  }

  return passos;
}
