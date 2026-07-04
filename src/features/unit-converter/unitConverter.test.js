import { describe, it, expect } from "vitest";
import { converter, converterParaTodas, fmtResultado } from "./unitConverter";

describe("comprimento", () => {
  it("1 km = 1000 m", () => {
    expect(converter(1, "comprimento", "km", "m")).toBeCloseTo(1000);
  });

  it("1 m = 100 cm", () => {
    expect(converter(1, "comprimento", "m", "cm")).toBeCloseTo(100);
  });

  it("1 milha ≈ 1609.344 m", () => {
    expect(converter(1, "comprimento", "mi", "m")).toBeCloseTo(1609.344);
  });

  it("mesma unidade retorna o valor original", () => {
    expect(converter(42, "comprimento", "m", "m")).toBeCloseTo(42);
  });
});

describe("massa", () => {
  it("1 kg = 1000 g", () => {
    expect(converter(1, "massa", "kg", "g")).toBeCloseTo(1000);
  });

  it("1 lb ≈ 453.592 g", () => {
    expect(converter(1, "massa", "lb", "g")).toBeCloseTo(453.592, 2);
  });
});

describe("temperatura", () => {
  it("0°C = 32°F", () => {
    expect(converter(0, "temperatura", "C", "F")).toBeCloseTo(32);
  });

  it("100°C = 212°F", () => {
    expect(converter(100, "temperatura", "C", "F")).toBeCloseTo(212);
  });

  it("0°C = 273.15K", () => {
    expect(converter(0, "temperatura", "C", "K")).toBeCloseTo(273.15);
  });

  it("-40°C = -40°F (ponto de interseção)", () => {
    expect(converter(-40, "temperatura", "C", "F")).toBeCloseTo(-40);
  });

  it("32°F = 0°C", () => {
    expect(converter(32, "temperatura", "F", "C")).toBeCloseTo(0);
  });

  it("273.15K = 0°C", () => {
    expect(converter(273.15, "temperatura", "K", "C")).toBeCloseTo(0);
  });
});

describe("volume", () => {
  it("1 l = 1000 ml", () => {
    expect(converter(1, "volume", "l", "ml")).toBeCloseTo(1000);
  });

  it("1 galão ≈ 3.785 l", () => {
    expect(converter(1, "volume", "gal", "l")).toBeCloseTo(3.785, 2);
  });
});

describe("converterParaTodas", () => {
  it("retorna todas as unidades da categoria", () => {
    const r = converterParaTodas(1, "comprimento", "m");
    expect(r).toHaveProperty("mm");
    expect(r).toHaveProperty("cm");
    expect(r).toHaveProperty("km");
    expect(r).toHaveProperty("mi");
    expect(r["m"]).toBeCloseTo(1);
    expect(r["cm"]).toBeCloseTo(100);
  });
});

describe("fmtResultado", () => {
  it('zero retorna "0"', () => expect(fmtResultado(0)).toBe("0"));
  it("inteiro simples", () => expect(fmtResultado(1000)).toBe("1000"));
  it("usa notação científica para valores muito pequenos", () => {
    expect(fmtResultado(0.000000123)).toContain("e");
  });
  it("6 dígitos significativos", () => {
    expect(fmtResultado(1.23456789)).toBe("1.23457");
  });
});
