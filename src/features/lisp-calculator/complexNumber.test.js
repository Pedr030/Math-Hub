import { describe, it, expect } from "vitest";
import { ComplexNumber } from "./complexNumber";

describe("ComplexNumber", () => {
  describe("operações aritméticas", () => {
    it("soma duas partes", () => {
      const r = new ComplexNumber(3, 4).somar(new ComplexNumber(1, 2));
      expect(r.real).toBe(4);
      expect(r.imag).toBe(6);
    });

    it("subtrai duas partes", () => {
      const r = new ComplexNumber(5, 3).subtrair(new ComplexNumber(2, 1));
      expect(r.real).toBe(3);
      expect(r.imag).toBe(2);
    });

    it("multiplica (a+bi)(c+di)", () => {
      // (3+4j)(1+2j) = (3-8) + (6+4)j = -5+10j
      const r = new ComplexNumber(3, 4).multiplicar(new ComplexNumber(1, 2));
      expect(r.real).toBe(-5);
      expect(r.imag).toBe(10);
    });

    it("divide (a+bi)/(c+di)", () => {
      // (3+4j)/(1+2j) = 2.2 - 0.4j
      const r = new ComplexNumber(3, 4).dividir(new ComplexNumber(1, 2));
      expect(r.real).toBeCloseTo(2.2);
      expect(r.imag).toBeCloseTo(-0.4); // ← era +0.4, corrigido para -0.4
    });

    it("lança erro ao dividir por zero", () => {
      expect(() =>
        new ComplexNumber(3, 4).dividir(new ComplexNumber(0, 0)),
      ).toThrow("Não pode dividir por zero");
    });
  });

  describe("conjugado e raiz", () => {
    it("calcula o conjugado", () => {
      const r = new ComplexNumber(3, 4).conjugado();
      expect(r.real).toBe(3);
      expect(r.imag).toBe(-4);
    });

    it("raiz quadrada de número positivo", () => {
      const r = new ComplexNumber(9, 0).raizQuadrada();
      expect(r.real).toBeCloseTo(3);
      expect(r.imag).toBeCloseTo(0);
    });

    it("raiz quadrada de número negativo produz imaginário", () => {
      // raiz(-4) = 0+2j
      const r = new ComplexNumber(-4, 0).raizQuadrada();
      expect(r.real).toBeCloseTo(0);
      expect(r.imag).toBeCloseTo(2);
    });
  });

  describe("potência", () => {
    it("potência inteira positiva", () => {
      // (3+4j)^2 = (9-16) + (24)j = -7+24j
      const r = new ComplexNumber(3, 4).potencia(2);
      expect(r.real).toBeCloseTo(-7);
      expect(r.imag).toBeCloseTo(24);
    });

    it("potência zero retorna 1+0j", () => {
      const r = new ComplexNumber(3, 4).potencia(0);
      expect(r.real).toBe(1);
      expect(r.imag).toBe(0);
    });
  });

  describe("fromString", () => {
    it("parseia número real", () => {
      const c = ComplexNumber.fromString("5");
      expect(c.real).toBe(5);
      expect(c.imag).toBe(0);
    });

    it("parseia número imaginário puro", () => {
      const c = ComplexNumber.fromString("j");
      expect(c.real).toBe(0);
      expect(c.imag).toBe(1);
    });

    it("parseia -j", () => {
      const c = ComplexNumber.fromString("-j");
      expect(c.real).toBe(0);
      expect(c.imag).toBe(-1);
    });

    it("parseia 3+4j", () => {
      const c = ComplexNumber.fromString("3+4j");
      expect(c.real).toBe(3);
      expect(c.imag).toBe(4);
    });

    it("parseia -3+2j", () => {
      const c = ComplexNumber.fromString("-3+2j");
      expect(c.real).toBe(-3);
      expect(c.imag).toBe(2);
    });
  });

  describe("toString", () => {
    it("formata com sinal positivo", () => {
      expect(new ComplexNumber(3, 4).toString()).toBe("(3+4j)");
    });

    it("formata com sinal negativo", () => {
      expect(new ComplexNumber(3, -4).toString()).toBe("(3-4j)");
    });
  });
});
