/**
 * Lógica de progressões aritméticas (PA) e geométricas (PG).
 * Funções puras — sem dependência de React ou UI.
 */

// ─── PA ──────────────────────────────────────────────────────────────────────

export function calcularPA(a1, razao, n) {
  const an = a1 + razao * (n - 1);
  const soma = (n * (a1 + an)) / 2;
  const termos = Array.from({ length: n }, (_, i) => a1 + razao * i);
  return { a1, razao, n, an, soma, termos };
}

export function termoGeralPA(a1, razao, n) {
  // an = a1 + (n-1) * r
  return a1 + razao * (n - 1);
}

// ─── PG ──────────────────────────────────────────────────────────────────────

export function calcularPG(a1, razao, n) {
  if (razao === 0) throw new Error("A razão de uma PG não pode ser zero.");

  const an = a1 * Math.pow(razao, n - 1);

  // Soma: a1 * (q^n - 1) / (q - 1) se q ≠ 1, senão n * a1
  const soma =
    razao === 1 ? n * a1 : (a1 * (Math.pow(razao, n) - 1)) / (razao - 1);

  const termos = Array.from({ length: n }, (_, i) => a1 * Math.pow(razao, i));
  return { a1, razao, n, an, soma, termos };
}

export function termoGeralPG(a1, razao, n) {
  // an = a1 * q^(n-1)
  return a1 * Math.pow(razao, n - 1);
}

// ─── Identificação automática ─────────────────────────────────────────────────

/**
 * Dado um array de números, identifica se é PA, PG, ambas ou nenhuma.
 * Retorna { tipoPA: bool, tipoPG: bool, razaoPA, razaoPG }
 */
export function identificarProgressao(nums) {
  if (nums.length < 2) return { tipoPA: false, tipoPG: false };

  // PA: diferença constante entre todos os termos consecutivos
  const diferencas = nums.slice(1).map((n, i) => n - nums[i]);
  const razaoPA = diferencas[0];
  const tipoPA = diferencas.every((d) => Math.abs(d - razaoPA) < 1e-9);

  // PG: razão constante entre todos os termos consecutivos
  // Só é PG se nenhum termo é zero
  let tipoPG = false;
  let razaoPG = null;
  if (nums.every((n) => n !== 0)) {
    const razoes = nums.slice(1).map((n, i) => n / nums[i]);
    razaoPG = razoes[0];
    tipoPG = razoes.every((r) => Math.abs(r - razaoPG) < 1e-9);
  }

  return {
    tipoPA,
    tipoPG,
    razaoPA: tipoPA ? razaoPA : null,
    razaoPG: tipoPG ? razaoPG : null,
  };
}

/**
 * Parseia uma string de números separados por vírgula, espaço ou ponto e vírgula.
 */
export function parsearSequencia(texto) {
  return texto
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map((s) => {
      const n = Number(s);
      if (isNaN(n)) throw new Error(`Valor inválido: "${s}"`);
      return n;
    });
}

// Formata número evitando casas decimais desnecessárias
export function fmt(n, casas = 4) {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(casas)).toString();
}
