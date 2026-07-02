import { describe, it, expect } from "vitest";
import {
  parsearNumeros,
  calcularMedia,
  calcularMediana,
  calcularModa,
  calcularVariancia,
  calcularEstatisticas,
} from "./statistics";

describe("parsearNumeros", () => {
  it("parseia separados por vírgula", () => {
    expect(parsearNumeros("1, 2, 3")).toEqual([1, 2, 3]);
  });

  it("parseia separados por espaço", () => {
    expect(parsearNumeros("1 2 3")).toEqual([1, 2, 3]);
  });

  it("parseia separados por ponto e vírgula", () => {
    expect(parsearNumeros("1;2;3")).toEqual([1, 2, 3]);
  });

  it("lança erro em valor inválido", () => {
    expect(() => parsearNumeros("1, abc, 3")).toThrow("Valor inválido");
  });
});

describe("calcularMedia", () => {
  it("média simples", () => {
    expect(calcularMedia([1, 2, 3, 4, 5])).toBe(3);
  });

  it("média com decimais", () => {
    expect(calcularMedia([1, 2])).toBe(1.5);
  });
});

describe("calcularMediana", () => {
  it("quantidade ímpar de elementos", () => {
    expect(calcularMediana([3, 1, 2])).toBe(2);
  });

  it("quantidade par de elementos", () => {
    expect(calcularMediana([1, 2, 3, 4])).toBe(2.5);
  });

  it("elemento único", () => {
    expect(calcularMediana([7])).toBe(7);
  });
});

describe("calcularModa", () => {
  it("moda simples", () => {
    expect(calcularModa([1, 2, 2, 3])).toEqual([2]);
  });

  it("múltiplas modas", () => {
    expect(calcularModa([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });

  it("sem moda (todos aparecem igualmente)", () => {
    expect(calcularModa([1, 2, 3])).toBeNull();
  });
});

describe("calcularVariancia", () => {
  it("variância de conjunto uniforme é zero", () => {
    expect(calcularVariancia([5, 5, 5], 5)).toBe(0);
  });

  it("variância conhecida", () => {
    // média = 2, desvios: -1, 0, 1 → variância = (1+0+1)/3 = 0.667
    expect(calcularVariancia([1, 2, 3], 2)).toBeCloseTo(0.6667, 3);
  });
});

describe("calcularEstatisticas (integração)", () => {
  it("resultado completo para conjunto simples", () => {
    const r = calcularEstatisticas("2 4 4 4 5 5 7 9");
    expect(r.contagem).toBe(8);
    expect(r.media).toBe(5);
    expect(r.mediana).toBe(4.5);
    expect(r.moda).toEqual([4]);
    expect(r.desvioPadrao).toBeCloseTo(2, 0);
    expect(r.minimo).toBe(2);
    expect(r.maximo).toBe(9);
    expect(r.amplitude).toBe(7);
  });

  it("lança erro para entrada vazia", () => {
    expect(() => calcularEstatisticas("   ")).toThrow();
  });

  it("lança erro para mais de 1000 valores", () => {
    const entrada = Array.from({ length: 1001 }, (_, i) => i).join(" ");
    expect(() => calcularEstatisticas(entrada)).toThrow("Máximo de 1000");
  });
});
