/**
 * Resolvedor de triângulos — lógica pura.
 * Convenção: lados a, b, c opostos aos ângulos A, B, C (em graus).
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export function grausParaRad(g) { return g * RAD; }
export function radParaGraus(r) { return r * DEG; }

function arredondar(n, casas = 6) {
  return parseFloat(n.toFixed(casas));
}

export function fmt(n) {
  if (n === null || n === undefined) return '—';
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toPrecision(7)).toString();
}

export function area(a, b, C) {
  return 0.5 * a * b * Math.sin(grausParaRad(C));
}

export function classificar(lados, angulos) {
  const [a, b, c] = lados.map(arredondar);
  const tipos = [];

  if (a === b && b === c) tipos.push('equilatero');
  else if (a === b || b === c || a === c) tipos.push('isosceles');
  else tipos.push('escaleno');

  const maxAng = Math.max(...angulos);
  if (Math.abs(maxAng - 90) < 0.001) tipos.push('retangulo');
  else if (maxAng > 90) tipos.push('obtusangulo');
  else tipos.push('acutangulo');

  return tipos;
}

// ─── Resolvedores por caso ────────────────────────────────────────────────────

function resolverLLL(a, b, c) {
  // Valida desigualdade triangular
  if (a + b <= c || a + c <= b || b + c <= a) {
    throw new Error('TRIANGULO_INVALIDO');
  }

  const A = radParaGraus(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  const B = radParaGraus(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
  const C = 180 - A - B;

  return [montarSolucao(a, b, c, A, B, C)];
}

function resolverLAL(a, C, b) {
  // Dois lados e o ângulo entre eles
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(grausParaRad(C)));
  const A = radParaGraus(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  const B = 180 - A - C;

  return [montarSolucao(a, b, c, A, B, C)];
}

function resolverALA(A, c, B) {
  // Dois ângulos e o lado entre eles
  const C = 180 - A - B;
  if (C <= 0) throw new Error('ANGULOS_INVALIDOS');

  const a = (c * Math.sin(grausParaRad(A))) / Math.sin(grausParaRad(C));
  const b = (c * Math.sin(grausParaRad(B))) / Math.sin(grausParaRad(C));

  return [montarSolucao(a, b, c, A, B, C)];
}

function resolverAAL(A, B, a) {
  // Dois ângulos e um lado não entre eles
  const C = 180 - A - B;
  if (C <= 0) throw new Error('ANGULOS_INVALIDOS');

  const b = (a * Math.sin(grausParaRad(B))) / Math.sin(grausParaRad(A));
  const c = (a * Math.sin(grausParaRad(C))) / Math.sin(grausParaRad(A));

  return [montarSolucao(a, b, c, A, B, C)];
}

function resolverSSA(a, b, A) {
  // Caso ambíguo: lado a oposto ao ângulo A, lado b adjacente
  const senB = (b * Math.sin(grausParaRad(A))) / a;

  if (senB > 1) throw new Error('TRIANGULO_INVALIDO');

  const B1 = radParaGraus(Math.asin(senB));
  const B2 = 180 - B1;

  const solucoes = [];

  // Solução 1
  const C1 = 180 - A - B1;
  if (C1 > 0) {
    const c1 = (a * Math.sin(grausParaRad(C1))) / Math.sin(grausParaRad(A));
    solucoes.push(montarSolucao(a, b, c1, A, B1, C1));
  }

  // Solução 2 (só existe se B2 < 180 - A)
  if (B2 < 180 - A) {
    const C2 = 180 - A - B2;
    if (C2 > 0) {
      const c2 = (a * Math.sin(grausParaRad(C2))) / Math.sin(grausParaRad(A));
      solucoes.push(montarSolucao(a, b, c2, A, B2, C2));
    }
  }

  if (solucoes.length === 0) throw new Error('TRIANGULO_INVALIDO');
  return solucoes;
}

function montarSolucao(a, b, c, A, B, C) {
  const lados = [a, b, c].map((n) => arredondar(n, 6));
  const angulos = [A, B, C].map((n) => arredondar(n, 6));
  const ar = area(lados[0], lados[1], angulos[2]);
  const perimetro = lados[0] + lados[1] + lados[2];
  const classif = classificar(lados, angulos);

  return { a: lados[0], b: lados[1], c: lados[2],
           A: angulos[0], B: angulos[1], C: angulos[2],
           area: arredondar(ar, 6), perimetro: arredondar(perimetro, 6),
           classificacao: classif };
}

// ─── Detector de caso e dispatcher ────────────────────────────────────────────

/**
 * Recebe um objeto { a, b, c, A, B, C } com null nos campos desconhecidos.
 * Detecta o caso e resolve, retornando array de soluções.
 */
export function resolver(entrada) {
  const { a, b, c, A, B, C } = entrada;
  const temLado = { a: a !== null, b: b !== null, c: c !== null };
  const temAng  = { A: A !== null, B: B !== null, C: C !== null };
  const nLados  = Object.values(temLado).filter(Boolean).length;
  const nAngs   = Object.values(temAng).filter(Boolean).length;

  // Precisa de pelo menos 3 informações, com ao menos 1 lado
  if (nLados + nAngs < 3) throw new Error('DADOS_INSUFICIENTES');
  if (nLados === 0) throw new Error('PRECISA_LADO');

  // Completa ângulos se dois são conhecidos
  let A_ = A, B_ = B, C_ = C;
  if (nAngs === 2) {
    if (!temAng.A) A_ = 180 - B - C;
    else if (!temAng.B) B_ = 180 - A - C;
    else C_ = 180 - A - B;
    if (A_ <= 0 || B_ <= 0 || C_ <= 0) throw new Error('ANGULOS_INVALIDOS');
  }

  // LLL
  if (nLados === 3) return resolverLLL(a, b, c);

  // LAL — dois lados e o ângulo ENTRE eles
  if (temLado.a && temLado.b && temAng.C) return resolverLAL(a, C_, b);
  if (temLado.a && temLado.c && temAng.B) return resolverLAL(a, B_, c);
  if (temLado.b && temLado.c && temAng.A) return resolverLAL(b, A_, c);

  // ALA — dois ângulos e o lado ENTRE eles
  if (temAng.A && temAng.B && temLado.c) return resolverALA(A_, c, B_);
  if (temAng.A && temAng.C && temLado.b) return resolverALA(A_, b, C_);
  if (temAng.B && temAng.C && temLado.a) return resolverALA(B_, a, C_);

  // AAL — dois ângulos e um lado NÃO entre eles
  if (nAngs >= 2 && nLados === 1) {
    if (temLado.a) return resolverAAL(A_, B_, a);
    if (temLado.b) return resolverAAL(B_, A_, b);
    if (temLado.c) return resolverAAL(C_, A_, c);
  }

  // SSA — dois lados e ângulo oposto a um deles (caso ambíguo)
  if (temLado.a && temLado.b && temAng.A) return resolverSSA(a, b, A_);
  if (temLado.a && temLado.b && temAng.B) return resolverSSA(b, a, B_);
  if (temLado.a && temLado.c && temAng.A) return resolverSSA(a, c, A_);
  if (temLado.a && temLado.c && temAng.C) return resolverSSA(c, a, C_);
  if (temLado.b && temLado.c && temAng.B) return resolverSSA(b, c, B_);
  if (temLado.b && temLado.c && temAng.C) return resolverSSA(c, b, C_);

  throw new Error('CASO_NAO_RECONHECIDO');
}