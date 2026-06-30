/**
 * Determinante e inversa de uma matriz 3x3.
 * Port direto de matriz3.py — mesmo algoritmo (regra de Sarrus +
 * matriz de cofatores + adjunta), só a sintaxe muda.
 */

export function determinante3x3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

export function inversa3x3(m) {
  const det = determinante3x3(m);
  if (det === 0) return null; // matriz singular, não tem inversa

  // Matriz de cofatores: cada posição é o determinante do "resto"
  // da matriz (menor complementar), com sinal alternado.
  const cof = [
    [
      m[1][1] * m[2][2] - m[1][2] * m[2][1],
      -(m[1][0] * m[2][2] - m[1][2] * m[2][0]),
      m[1][0] * m[2][1] - m[1][1] * m[2][0],
    ],
    [
      -(m[0][1] * m[2][2] - m[0][2] * m[2][1]),
      m[0][0] * m[2][2] - m[0][2] * m[2][0],
      -(m[0][0] * m[2][1] - m[0][1] * m[2][0]),
    ],
    [
      m[0][1] * m[1][2] - m[0][2] * m[1][1],
      -(m[0][0] * m[1][2] - m[0][2] * m[1][0]),
      m[0][0] * m[1][1] - m[0][1] * m[1][0],
    ],
  ];

  // Matriz adjunta = transposta da matriz de cofatores
  const adj = [
    [cof[0][0], cof[1][0], cof[2][0]],
    [cof[0][1], cof[1][1], cof[2][1]],
    [cof[0][2], cof[1][2], cof[2][2]],
  ];

  // Inversa = adjunta / determinante
  return adj.map((linha) => linha.map((valor) => valor / det));
}

/**
 * Resolve o sistema R * I = V usando a matriz inversa: I = R⁻¹ * V.
 * Equivalente ao cálculo de "resultado" em circuito.py.
 */
export function resolverSistema(matrizR, vetorV) {
  const inv = inversa3x3(matrizR);
  if (!inv) return null;

  return inv.map((linha) =>
    linha.reduce((soma, valor, j) => soma + valor * vetorV[j], 0),
  );
}
