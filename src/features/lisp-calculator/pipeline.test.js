import { describe, it, expect } from "vitest";
import { analisar } from "./pipeline";
import { avaliar } from "./evaluator";
import { ComplexNumber } from "./complexNumber";

describe("pipeline completo", () => {
  it("exemplo do README: (3+4j) * conj(3+4j) = 25+0j", () => {
    const { arvore, lisp, variaveis } = analisar("(3+4j) * conj(3+4j)");
    const resultado = avaliar(arvore, {});

    expect(resultado.real).toBeCloseTo(25);
    expect(resultado.imag).toBeCloseTo(0);
    expect(lisp).toBe("(* (+ 3 4j) (conj (+ 3 4j)))");
    expect(variaveis).toEqual([]);
  });

  it("detecta variáveis corretamente", () => {
    const { variaveis } = analisar("a + b * 2");
    expect(variaveis).toEqual(["a", "b"]);
  });

  it('"j" solto não é tratado como variável', () => {
    // Bug corrigido: (2+3j)*(4-j) não deve pedir valor pra "j"
    const { variaveis } = analisar("(2+3j) * (4-j)");
    expect(variaveis).toEqual([]);
  });

  it("avalia expressão com variáveis", () => {
    const { arvore } = analisar("a + 2");
    const resultado = avaliar(arvore, {
      a: new ComplexNumber(3, 1),
    });
    expect(resultado.real).toBe(5);
    expect(resultado.imag).toBe(1);
  });

  it("raiz de número negativo", () => {
    const { arvore } = analisar("raiz(-4)");
    const resultado = avaliar(arvore, {});
    expect(resultado.real).toBeCloseTo(0);
    expect(resultado.imag).toBeCloseTo(2);
  });

  it("lança erro em parênteses desbalanceados", () => {
    expect(() => analisar("(3+4j")).toThrow("Parênteses desbalanceados");
  });

  it("lança erro ao dividir por zero", () => {
    const { arvore } = analisar("5 / 0");
    expect(() => avaliar(arvore, {})).toThrow("Não pode dividir por zero");
  });
});
