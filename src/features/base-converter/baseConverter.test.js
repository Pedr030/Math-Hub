import { describe, it, expect } from "vitest";
import { ehValido, converterParaTodas, passosConversao } from "./baseConverter";

describe("ehValido", () => {
  it("aceita binário válido", () => expect(ehValido("1010", 2)).toBe(true));
  it("rejeita binário inválido", () => expect(ehValido("1021", 2)).toBe(false));
  it("aceita octal válido", () => expect(ehValido("77", 8)).toBe(true));
  it("rejeita octal inválido", () => expect(ehValido("89", 8)).toBe(false));
  it("aceita decimal válido", () => expect(ehValido("255", 10)).toBe(true));
  it("aceita hexadecimal com letras", () =>
    expect(ehValido("FF", 16)).toBe(true));
  it("rejeita hexadecimal inválido", () =>
    expect(ehValido("GG", 16)).toBe(false));
  it("rejeita string vazia", () => expect(ehValido("", 10)).toBe(false));
});

describe("converterParaTodas", () => {
  it("converte 255 decimal para todas as bases", () => {
    const r = converterParaTodas("255", 10);
    expect(r[2]).toBe("11111111");
    expect(r[8]).toBe("377");
    expect(r[10]).toBe("255");
    expect(r[16]).toBe("FF");
  });

  it("converte FF hexadecimal", () => {
    const r = converterParaTodas("FF", 16);
    expect(r[10]).toBe("255");
    expect(r[2]).toBe("11111111");
  });

  it("converte 1010 binário", () => {
    const r = converterParaTodas("1010", 2);
    expect(r[10]).toBe("10");
    expect(r[16]).toBe("A");
  });

  it("converte zero", () => {
    const r = converterParaTodas("0", 10);
    expect(r[2]).toBe("0");
    expect(r[16]).toBe("0");
  });

  it("lança erro para valor inválido", () => {
    expect(() => converterParaTodas("XYZ", 10)).toThrow();
  });
});

describe("passosConversao", () => {
  it("retorna array vazio para base 10", () => {
    expect(passosConversao(255, 10)).toEqual([]);
  });

  it("retorna passo único para zero", () => {
    const passos = passosConversao(0, 2);
    expect(passos).toHaveLength(1);
    expect(passos[0].resto).toBe(0);
  });

  it("converte 10 para binário em 4 passos", () => {
    const passos = passosConversao(10, 2);
    expect(passos).toHaveLength(4);
    // restos lidos de baixo pra cima = 1010
    const restos = passos
      .map((p) => p.resto)
      .reverse()
      .join("");
    expect(restos).toBe("1010");
  });

  it("converte 255 para hex em 2 passos", () => {
    const passos = passosConversao(255, 16);
    expect(passos).toHaveLength(2);
  });
});
