import { describe, it, expect } from "vitest";
import {
  somar,
  subtrair,
  multiplicar,
  transposta,
  determinante2x2,
  determinante3x3,
  determinante,
  parseMatriz,
  fmt,
} from "./matrixOps";

const A2 = [
  [1, 2],
  [3, 4],
];
const B2 = [
  [5, 6],
  [7, 8],
];
const A3 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const I3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]; // identidade 3x3

describe("somar", () => {
  it("soma duas matrizes 2x2", () => {
    expect(somar(A2, B2)).toEqual([
      [6, 8],
      [10, 12],
    ]);
  });

  it("soma com zeros não muda a matriz", () => {
    const zeros = [
      [0, 0],
      [0, 0],
    ];
    expect(somar(A2, zeros)).toEqual(A2);
  });
});

describe("subtrair", () => {
  it("subtrai duas matrizes 2x2", () => {
    expect(subtrair(B2, A2)).toEqual([
      [4, 4],
      [4, 4],
    ]);
  });

  it("A - A = zero", () => {
    expect(subtrair(A2, A2)).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });
});

describe("multiplicar", () => {
  it("multiplicação 2x2 conhecida", () => {
    // [[1,2],[3,4]] × [[5,6],[7,8]] = [[19,22],[43,50]]
    expect(multiplicar(A2, B2)).toEqual([
      [19, 22],
      [43, 50],
    ]);
  });

  it("A × identidade = A", () => {
    const I2 = [
      [1, 0],
      [0, 1],
    ];
    expect(multiplicar(A2, I2)).toEqual(A2);
  });

  it("multiplicação 3x3 com identidade", () => {
    expect(multiplicar(A3, I3)).toEqual(A3);
  });
});

describe("transposta", () => {
  it("transposta 2x2", () => {
    expect(
      transposta([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it("transposta de transposta = original", () => {
    expect(transposta(transposta(A2))).toEqual(A2);
  });

  it("transposta 3x3", () => {
    const t = transposta(A3);
    expect(t[0]).toEqual([1, 4, 7]);
    expect(t[1]).toEqual([2, 5, 8]);
    expect(t[2]).toEqual([3, 6, 9]);
  });
});

describe("determinante", () => {
  it("det 2x2 simples", () => {
    expect(
      determinante2x2([
        [1, 2],
        [3, 4],
      ]),
    ).toBe(-2);
  });

  it("det identidade 2x2 = 1", () => {
    expect(
      determinante2x2([
        [1, 0],
        [0, 1],
      ]),
    ).toBe(1);
  });

  it("det matriz singular 2x2 = 0", () => {
    expect(
      determinante2x2([
        [1, 2],
        [2, 4],
      ]),
    ).toBe(0);
  });

  it("det 3x3 singular = 0", () => {
    // A3 = [[1,2,3],[4,5,6],[7,8,9]] é singular
    expect(determinante3x3(A3)).toBeCloseTo(0);
  });

  it("det identidade 3x3 = 1", () => {
    expect(determinante3x3(I3)).toBe(1);
  });

  it("função determinante delega pela dimensão", () => {
    expect(
      determinante([
        [1, 2],
        [3, 4],
      ]),
    ).toBe(-2);
    expect(determinante(I3)).toBe(1);
  });
});

describe("parseMatriz", () => {
  it("converte strings para números", () => {
    expect(
      parseMatriz([
        ["1", "2"],
        ["3", "4"],
      ]),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("lança erro em campo vazio", () => {
    expect(() =>
      parseMatriz([
        ["1", ""],
        ["3", "4"],
      ]),
    ).toThrow("Valor inválido");
  });

  it("lança erro em valor não numérico", () => {
    expect(() =>
      parseMatriz([
        ["1", "abc"],
        ["3", "4"],
      ]),
    ).toThrow("Valor inválido");
  });
});

describe("fmt", () => {
  it("inteiro sem decimal", () => expect(fmt(5)).toBe("5"));
  it("float com casas necessárias", () => expect(fmt(1.5)).toBe("1.5"));
  it("arredonda para 4 casas", () => expect(fmt(1.23456)).toBe("1.2346"));
});
