import { describe, it, expect } from "vitest";
import { calcularSimples, calcularComposto } from "./interest";

describe("calcularSimples", () => {
  it("M = C * (1 + i*t)", () => {
    const r = calcularSimples(1000, 10, 2);
    expect(r.montanteFinal).toBeCloseTo(1200);
    expect(r.jurosTotais).toBeCloseTo(200);
  });

  it("tabela tem um item por período", () => {
    const r = calcularSimples(1000, 5, 12);
    expect(r.tabela).toHaveLength(12);
  });

  it("juros crescem linearmente", () => {
    const r = calcularSimples(1000, 10, 3);
    // Cada período adiciona o mesmo valor de juros
    const dif1 = r.tabela[1].juros - r.tabela[0].juros;
    const dif2 = r.tabela[2].juros - r.tabela[1].juros;
    expect(dif1).toBeCloseTo(dif2);
  });

  it("período 1 bate com a fórmula direta", () => {
    const r = calcularSimples(500, 2, 1);
    expect(r.tabela[0].montante).toBeCloseTo(510);
  });
});

describe("calcularComposto", () => {
  it("M = C * (1 + i)^t", () => {
    const r = calcularComposto(1000, 10, 2);
    // 1000 * 1.1^2 = 1210
    expect(r.montanteFinal).toBeCloseTo(1210);
    expect(r.jurosTotais).toBeCloseTo(210);
  });

  it("juros compostos > juros simples para t > 1", () => {
    const simples = calcularSimples(1000, 10, 5);
    const composto = calcularComposto(1000, 10, 5);
    expect(composto.montanteFinal).toBeGreaterThan(simples.montanteFinal);
  });

  it("juros compostos = juros simples para t = 1", () => {
    const simples = calcularSimples(1000, 10, 1);
    const composto = calcularComposto(1000, 10, 1);
    expect(composto.montanteFinal).toBeCloseTo(simples.montanteFinal);
  });

  it("tabela tem um item por período", () => {
    const r = calcularComposto(1000, 5, 24);
    expect(r.tabela).toHaveLength(24);
  });

  it("crescimento exponencial: cada período multiplica pelo mesmo fator", () => {
    const r = calcularComposto(1000, 10, 3);
    const fator1 = r.tabela[1].montante / r.tabela[0].montante;
    const fator2 = r.tabela[2].montante / r.tabela[1].montante;
    expect(fator1).toBeCloseTo(fator2);
  });
});
