/**
 * Funções de estatística descritiva.
 * Todas puras — sem dependência de React ou UI.
 */

export function parsearNumeros(texto) {
  // Aceita números separados por vírgula, espaço, ponto e vírgula ou quebra de linha
  return texto
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map((s) => {
      const n = Number(s.replace(",", "."));
      if (isNaN(n)) throw new Error(`Valor inválido: "${s}"`);
      return n;
    });
}

export function calcularMedia(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calcularMediana(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const meio = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[meio - 1] + sorted[meio]) / 2
    : sorted[meio];
}

export function calcularModa(nums) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  const maxFreq = Math.max(...freq.values());

  // Se todos aparecem a mesma quantidade de vezes, não há moda
  if (maxFreq === 1) return null;

  return [...freq.entries()]
    .filter(([, f]) => f === maxFreq)
    .map(([n]) => n)
    .sort((a, b) => a - b);
}

export function calcularVariancia(nums, media) {
  // Variância populacional (dividida por N, não N-1)
  return (
    nums.reduce((soma, n) => soma + Math.pow(n - media, 2), 0) / nums.length
  );
}

export function calcularEstatisticas(texto) {
  const nums = parsearNumeros(texto);

  if (nums.length === 0) throw new Error("Nenhum número encontrado.");
  if (nums.length > 1000) throw new Error("Máximo de 1000 valores por vez.");

  const sorted = [...nums].sort((a, b) => a - b);
  const media = calcularMedia(nums);
  const variancia = calcularVariancia(nums, media);

  return {
    contagem: nums.length,
    soma: nums.reduce((a, b) => a + b, 0),
    media,
    mediana: calcularMediana(nums),
    moda: calcularModa(nums),
    variancia,
    desvioPadrao: Math.sqrt(variancia),
    minimo: sorted[0],
    maximo: sorted[sorted.length - 1],
    amplitude: sorted[sorted.length - 1] - sorted[0],
    numeros: sorted,
  };
}
