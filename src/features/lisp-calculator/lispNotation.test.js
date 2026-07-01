import { describe, it, expect } from "vitest";
import { analisar } from "./pipeline";

describe("notação LISP", () => {
  it("operação binária simples", () => {
    expect(analisar("3 + 4").lisp).toBe("(+ 3 4)");
  });

  it("respeita precedência de operadores", () => {
    // 3 + 4 * 2 → a multiplicação tem prioridade
    expect(analisar("3 + 4 * 2").lisp).toBe("(+ 3 (* 4 2))");
  });

  it("função unária", () => {
    expect(analisar("conj(3+4j)").lisp).toBe("(conj (+ 3 4j))");
  });

  it("expressão aninhada", () => {
    expect(analisar("(3+4j) * conj(3+4j)").lisp).toBe(
      "(* (+ 3 4j) (conj (+ 3 4j)))",
    );
  });
});
