/**
 * Lógica de busca e cache das cotações.
 * Separada do componente React pra facilitar testes e reutilização.
 *
 * Estratégia de cache: as taxas ficam no localStorage com timestamp.
 * Se passaram menos de 24h, usa o cache — o plano gratuito da API
 * atualiza as cotações uma vez por dia, então não adianta buscar com
 * mais frequência e desperdiça requisições da cota mensal.
 */

const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
const CACHE_PREFIX = "math-hub-rates-";

export const MOEDAS = [
  { codigo: "BRL", nome: "Real Brasileiro" },
  { codigo: "USD", nome: "Dólar Americano" },
  { codigo: "EUR", nome: "Euro" },
  { codigo: "GBP", nome: "Libra Esterlina" },
  { codigo: "ARS", nome: "Peso Argentino" },
  { codigo: "CAD", nome: "Dólar Canadense" },
  { codigo: "CHF", nome: "Franco Suíço" },
  { codigo: "CNY", nome: "Yuan Chinês" },
  { codigo: "JPY", nome: "Iene Japonês" },
  { codigo: "MXN", nome: "Peso Mexicano" },
];

function lerCache(moedaBase) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + moedaBase);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > TTL_MS) return null; // expirado
    return cache;
  } catch {
    return null;
  }
}

function salvarCache(moedaBase, rates, atualizadoEm) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + moedaBase,
      JSON.stringify({ rates, atualizadoEm, timestamp: Date.now() }),
    );
  } catch {
    // localStorage pode estar bloqueado (modo privado em alguns browsers)
  }
}

/**
 * Busca as taxas de câmbio para uma moeda base.
 * Retorna { rates, atualizadoEm } — do cache ou da API.
 */
export async function buscarTaxas(moedaBase) {
  const cache = lerCache(moedaBase);
  if (cache)
    return {
      rates: cache.rates,
      atualizadoEm: cache.atualizadoEm,
      doCache: true,
    };

  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
  if (!apiKey) throw new Error("API key não configurada.");

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${moedaBase}`,
  );

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();

  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Erro desconhecido na API");
  }

  const rates = data.conversion_rates;
  const atualizadoEm = data.time_last_update_unix * 1000; // converte pra ms

  salvarCache(moedaBase, rates, atualizadoEm);
  return { rates, atualizadoEm, doCache: false };
}

export function converter(valor, taxaOrigem, taxaDestino) {
  // Todas as taxas são relativas à moeda base.
  // Para converter A→B: valor / taxaOrigem * taxaDestino
  // (quando a moeda base já é A, taxaOrigem = 1)
  return (valor / taxaOrigem) * taxaDestino;
}
