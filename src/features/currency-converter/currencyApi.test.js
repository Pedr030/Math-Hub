import { describe, it, expect, beforeEach, vi } from "vitest";
import { buscarTaxas, converter } from "./currencyApi";

// ─── Dados de teste ───────────────────────────────────────────────────────────

const RATES_MOCK = {
  BRL: 1,
  USD: 0.2,
  EUR: 0.18,
};

const API_RESPONSE_MOCK = {
  result: "success",
  conversion_rates: RATES_MOCK,
  time_last_update_unix: 1700000000,
};

// ─── Setup ───────────────────────────────────────────────────────────────────
// Mock manual do localStorage — necessário porque o ambiente de teste
// é Node.js (sem DOM). Simula o comportamento real: armazena num objeto
// em memória e reseta antes de cada teste para garantir isolamento.
let localStore = {};
const localStorageMock = {
  getItem: vi.fn((key) => localStore[key] ?? null),
  setItem: vi.fn((key, val) => {
    localStore[key] = String(val);
  }),
  removeItem: vi.fn((key) => {
    delete localStore[key];
  }),
  clear: vi.fn(() => {
    localStore = {};
  }),
};

beforeEach(() => {
  vi.restoreAllMocks();
  localStore = {};

  // Injeta o mock como global.localStorage — é assim que o currencyApi.js
  // acessa o localStorage, então substituir aqui cobre todos os usos.
  Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  // Reseta os contadores de chamada dos mocks entre testes
  Object.values(localStorageMock).forEach((fn) => fn.mockClear());

  vi.stubEnv("VITE_EXCHANGE_RATE_API_KEY", "chave-de-teste");
});
// ─── converter() ──────────────────────────────────────────────────────────────

describe("converter", () => {
  it("converte BRL para USD", () => {
    // 100 BRL / 1 (taxa BRL) * 0.2 (taxa USD) = 20 USD
    expect(converter(100, 1, 0.2)).toBeCloseTo(20);
  });

  it("converte USD para EUR", () => {
    // 50 USD / 0.2 * 0.18 = 45 EUR
    expect(converter(50, 0.2, 0.18)).toBeCloseTo(45);
  });

  it("mesma moeda retorna o valor original", () => {
    expect(converter(100, 1, 1)).toBeCloseTo(100);
  });

  it("valor zero retorna zero", () => {
    expect(converter(0, 1, 0.2)).toBe(0);
  });
});

// ─── buscarTaxas() — sem cache ────────────────────────────────────────────────

describe("buscarTaxas — chamada à API", () => {
  beforeEach(() => {
    // Mock global do fetch: retorna uma resposta simulada da API.
    // vi.fn() cria uma função falsa que registra suas chamadas e retorna
    // o que você mandar — perfeito pra simular fetch sem rede.
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => API_RESPONSE_MOCK,
    });
  });

  it("chama a URL correta com a moeda base", async () => {
    await buscarTaxas("BRL");

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/latest/BRL"));
  });

  it("retorna as taxas e o timestamp corretos", async () => {
    const resultado = await buscarTaxas("BRL");

    expect(resultado.rates).toEqual(RATES_MOCK);
    expect(resultado.atualizadoEm).toBe(1700000000 * 1000);
    expect(resultado.doCache).toBe(false);
  });

  it("salva no cache após busca bem-sucedida", async () => {
    await buscarTaxas("BRL");

    // Verifica que localStorage.setItem foi chamado com a chave certa
    expect(localStorage.setItem).toHaveBeenCalledWith(
      expect.stringContaining("BRL"),
      expect.any(String),
    );
  });

  it("lança erro quando a API retorna ok: false", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    });

    await expect(buscarTaxas("BRL")).rejects.toThrow("Erro na API: 429");
  });

  it("lança erro quando a API retorna result != success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: "error",
        "error-type": "invalid-key",
      }),
    });

    await expect(buscarTaxas("BRL")).rejects.toThrow("invalid-key");
  });

  it("lança erro quando a API key não está configurada", async () => {
    vi.stubEnv("VITE_EXCHANGE_RATE_API_KEY", "");

    await expect(buscarTaxas("BRL")).rejects.toThrow("API key não configurada");
  });
});

// ─── buscarTaxas() — com cache ────────────────────────────────────────────────

describe("buscarTaxas — cache", () => {
  it("usa cache válido e não chama fetch", async () => {
    // Simula um cache recente (timestamp = agora)
    const cacheValido = JSON.stringify({
      rates: RATES_MOCK,
      atualizadoEm: 1700000000 * 1000,
      timestamp: Date.now(), // recente → válido
    });
    localStorage.setItem("math-hub-rates-BRL", cacheValido);

    global.fetch = vi.fn();

    const resultado = await buscarTaxas("BRL");

    expect(fetch).not.toHaveBeenCalled();
    expect(resultado.doCache).toBe(true);
    expect(resultado.rates).toEqual(RATES_MOCK);
  });

  it("ignora cache expirado e busca da API", async () => {
    // Simula cache com timestamp de 25 horas atrás (expirado)
    const cacheExpirado = JSON.stringify({
      rates: RATES_MOCK,
      atualizadoEm: 1700000000 * 1000,
      timestamp: Date.now() - 25 * 60 * 60 * 1000,
    });
    localStorage.setItem("math-hub-rates-BRL", cacheExpirado);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => API_RESPONSE_MOCK,
    });

    const resultado = await buscarTaxas("BRL");

    expect(fetch).toHaveBeenCalledOnce();
    expect(resultado.doCache).toBe(false);
  });

  it("ignora cache corrompido e busca da API", async () => {
    localStorage.setItem("math-hub-rates-BRL", "json-invalido-{{{");

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => API_RESPONSE_MOCK,
    });

    const resultado = await buscarTaxas("BRL");

    expect(fetch).toHaveBeenCalledOnce();
    expect(resultado.doCache).toBe(false);
  });
});
