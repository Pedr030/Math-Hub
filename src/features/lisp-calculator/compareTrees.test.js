import { describe, it, expect } from "vitest";
import { analisar } from "./pipeline";
import { arvoresIguais } from "./compareTrees";

describe("comparação de árvores", () => {
  it("mesma expressão é estruturalmente igual", () => {
    const a = analisar("(a + b) * conj(c)");
    const b = analisar("(a + b) * conj(c)");
    expect(arvoresIguais(a.arvore, b.arvore)).toBe(true);
  });

  it("expressões diferentes não são iguais", () => {
    const a = analisar("(a + b) * conj(c)");
    const b = analisar("(a + b) * raiz(c)");
    expect(arvoresIguais(a.arvore, b.arvore)).toBe(false);
  });

  it("ordem diferente não é igual", () => {
    const a = analisar("a + b");
    const b = analisar("b + a");
    expect(arvoresIguais(a.arvore, b.arvore)).toBe(false);
  });

  it("null e null são iguais", () => {
    expect(arvoresIguais(null, null)).toBe(true);
  });

  it("null e não-null não são iguais", () => {
    const a = analisar("3 + 4");
    expect(arvoresIguais(a.arvore, null)).toBe(false);
  });
});
