import { describe, it, expect } from "vitest";
import {
  calcularPA,
  calcularPG,
  termoGeralPA,
  termoGeralPG,
  identificarProgressao,
  parsearSequencia,
  fmt,
} from "./progressionCalc";

describe("calcularPA", () => {
  it("PA clássica: a1=2, r=3, n=5", () => {
    const r = calcularPA(2, 3, 5);
    expect(r.an).toBe(14);
    expect(r.soma).toBe(40);
    expect(r.termos).toEqual([2, 5, 8, 11, 14]);
  });

  it("PA com razão negativa", () => {
    const r = calcularPA(10, -2, 4);
    expect(r.an).toBe(4);
    expect(r.termos).toEqual([10, 8, 6, 4]);
  });

  it("PA com razão zero (todos iguais)", () => {
    const r = calcularPA(5, 0, 3);
    expect(r.an).toBe(5);
    expect(r.soma).toBe(15);
  });

  it("PA com 1 termo", () => {
    const r = calcularPA(7, 2, 1);
    expect(r.an).toBe(7);
    expect(r.soma).toBe(7);
    expect(r.termos).toHaveLength(1);
  });
});

describe("calcularPG", () => {
  it("PG clássica: a1=2, q=3, n=4", () => {
    const r = calcularPG(2, 3, 4);
    expect(r.an).toBe(54);
    expect(r.soma).toBe(80);
    expect(r.termos).toEqual([2, 6, 18, 54]);
  });

  it("PG com razão 1 (todos iguais)", () => {
    const r = calcularPG(5, 1, 3);
    expect(r.soma).toBe(15);
    expect(r.termos).toEqual([5, 5, 5]);
  });

  it("PG com razão fracionária", () => {
    const r = calcularPG(16, 0.5, 4);
    expect(r.an).toBeCloseTo(2);
    expect(r.termos[1]).toBe(8);
  });

  it("lança erro com razão zero", () => {
    expect(() => calcularPG(2, 0, 3)).toThrow("razão");
  });
});

describe("termoGeral", () => {
  it("termoGeralPA", () => {
    expect(termoGeralPA(2, 3, 5)).toBe(14);
  });

  it("termoGeralPG", () => {
    expect(termoGeralPG(2, 3, 4)).toBe(54);
  });
});

describe("identificarProgressao", () => {
  it("identifica PA", () => {
    const r = identificarProgressao([2, 5, 8, 11, 14]);
    expect(r.tipoPA).toBe(true);
    expect(r.razaoPA).toBe(3);
    expect(r.tipoPG).toBe(false);
  });

  it("identifica PG", () => {
    const r = identificarProgressao([2, 6, 18, 54]);
    expect(r.tipoPG).toBe(true);
    expect(r.razaoPG).toBe(3);
    expect(r.tipoPA).toBe(false);
  });

  it("identifica PA e PG (todos iguais)", () => {
    const r = identificarProgressao([1, 1, 1, 1]);
    expect(r.tipoPA).toBe(true);
    expect(r.tipoPG).toBe(true);
  });

  it("não é PA nem PG", () => {
    const r = identificarProgressao([1, 2, 4, 7]);
    expect(r.tipoPA).toBe(false);
    expect(r.tipoPG).toBe(false);
  });

  it("não identifica PG com zeros", () => {
    const r = identificarProgressao([0, 0, 0]);
    expect(r.tipoPG).toBe(false);
  });
});

describe("parsearSequencia", () => {
  it("vírgula", () => expect(parsearSequencia("1, 2, 3")).toEqual([1, 2, 3]));
  it("espaço", () => expect(parsearSequencia("1 2 3")).toEqual([1, 2, 3]));
  it("ponto e vírgula", () =>
    expect(parsearSequencia("1;2;3")).toEqual([1, 2, 3]));
  it("lança erro em valor inválido", () => {
    expect(() => parsearSequencia("1, abc, 3")).toThrow("Valor inválido");
  });
});

describe("fmt", () => {
  it("inteiro", () => expect(fmt(5)).toBe("5"));
  it("float", () => expect(fmt(1.5)).toBe("1.5"));
  it("arredonda", () => expect(fmt(1.23456)).toBe("1.2346"));
});
