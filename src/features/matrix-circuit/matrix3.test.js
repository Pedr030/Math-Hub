import { describe, it, expect } from "vitest";
import { determinante3x3, inversa3x3, resolverSistema } from "./matrix3";

describe("matrix3", () => {
  describe("determinante", () => {
    it("calcula determinante corretamente", () => {
      const m = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      // Matriz singular — det = 0
      expect(determinante3x3(m)).toBeCloseTo(0);
    });

    it("matriz identidade tem determinante 1", () => {
      const identidade = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
      expect(determinante3x3(identidade)).toBe(1);
    });
  });

  describe("inversa", () => {
    it("retorna null para matriz singular", () => {
      const m = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      expect(inversa3x3(m)).toBeNull();
    });

    it("inversa da identidade é a própria identidade", () => {
      const identidade = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
      const inv = inversa3x3(identidade);
      expect(inv[0][0]).toBeCloseTo(1);
      expect(inv[1][1]).toBeCloseTo(1);
      expect(inv[2][2]).toBeCloseTo(1);
      expect(inv[0][1]).toBeCloseTo(0);
    });
  });

  describe("resolverSistema", () => {
    it("exemplo exato do README original", () => {
      const R = [
        [5, 2, 1],
        [1, 4, 2],
        [2, 1, 6],
      ];
      const V = [12, 10, 15];
      const correntes = resolverSistema(R, V);

      expect(correntes[0]).toBeCloseTo(1.556, 2);
      expect(correntes[1]).toBeCloseTo(1.222, 2);
      expect(correntes[2]).toBeCloseTo(1.778, 2);
    });

    it("correntes negativas são válidas", () => {
      const R = [
        [3, 3, 5],
        [2, 3, 2],
        [1, 1, 3],
      ];
      const V = [2, 3, -1];
      const correntes = resolverSistema(R, V);

      expect(correntes[0]).toBeCloseTo(2.75, 2);
      expect(correntes[1]).toBeCloseTo(0, 2);
      expect(correntes[2]).toBeCloseTo(-1.25, 2);
    });

    it("retorna null para sistema sem solução", () => {
      const R = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      expect(resolverSistema(R, [1, 2, 3])).toBeNull();
    });

    it("verificação: R * I = V", () => {
      const R = [
        [5, 2, 1],
        [1, 4, 2],
        [2, 1, 6],
      ];
      const V = [12, 10, 15];
      const I = resolverSistema(R, V);

      // Substitui de volta nas equações originais
      R.forEach((linha, i) => {
        const calc = linha.reduce((soma, r, j) => soma + r * I[j], 0);
        expect(calc).toBeCloseTo(V[i], 5);
      });
    });
  });
});
