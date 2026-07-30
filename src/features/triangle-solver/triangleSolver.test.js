import { describe, it, expect } from 'vitest';
import { resolver, area, classificar } from './triangleSolver';

function n(v) { return v !== null ? parseFloat(v.toFixed(4)) : null; }

describe('LLL — três lados', () => {
  it('triângulo 3-4-5 (retângulo)', () => {
    const [s] = resolver({ a: 3, b: 4, c: 5, A: null, B: null, C: null });
    expect(n(s.C)).toBe(90);
    expect(s.classificacao).toContain('retangulo');
    expect(s.classificacao).toContain('escaleno');
  });

  it('triângulo equilátero', () => {
    const [s] = resolver({ a: 5, b: 5, c: 5, A: null, B: null, C: null });
    expect(n(s.A)).toBe(60);
    expect(s.classificacao).toContain('equilatero');
    expect(s.classificacao).toContain('acutangulo');
  });

  it('lança erro para lados inválidos', () => {
    expect(() => resolver({ a: 1, b: 2, c: 10, A: null, B: null, C: null }))
      .toThrow('TRIANGULO_INVALIDO');
  });
});

describe('LAL — dois lados e ângulo entre eles', () => {
  it('calcula o terceiro lado corretamente', () => {
    // a=5, b=7, C=60°
    const [s] = resolver({ a: 5, b: 7, c: null, A: null, B: null, C: 60 });
    expect(n(s.c)).toBeCloseTo(6.2450, 2);
  });
});

describe('ALA — dois ângulos e lado entre eles', () => {
  it('triângulo com A=50, B=60, c=10', () => {
    const [s] = resolver({ a: null, b: null, c: 10, A: 50, B: 60, C: null });
    expect(n(s.C)).toBe(70);
    expect(s.a).toBeGreaterThan(0);
    expect(s.b).toBeGreaterThan(0);
  });
});

describe('AAL — dois ângulos e lado não entre eles', () => {
  it('calcula os outros lados', () => {
    const [s] = resolver({ a: 8, b: null, c: null, A: 40, B: 60, C: null });
    expect(n(s.C)).toBe(80);
    expect(s.b).toBeGreaterThan(0);
    expect(s.c).toBeGreaterThan(0);
  });
});

describe('SSA — caso ambíguo', () => {
  it('retorna duas soluções quando ambíguo', () => {
    // a=10, b=15, A=30° — caso clássico com 2 soluções
    const sols = resolver({ a: 10, b: 15, c: null, A: 30, B: null, C: null });
    expect(sols.length).toBe(2);
  });

  it('retorna uma solução quando não ambíguo', () => {
    const sols = resolver({ a: 20, b: 10, c: null, A: 60, B: null, C: null });
    expect(sols.length).toBe(1);
  });

  it('lança erro quando triângulo impossível', () => {
    expect(() => resolver({ a: 5, b: 20, c: null, A: 30, B: null, C: null }))
      .toThrow('TRIANGULO_INVALIDO');
  });
});

describe('Validações gerais', () => {
  it('lança erro com dados insuficientes', () => {
    expect(() => resolver({ a: 5, b: null, c: null, A: null, B: null, C: null }))
      .toThrow('DADOS_INSUFICIENTES');
  });

  it('lança erro sem nenhum lado', () => {
    expect(() => resolver({ a: null, b: null, c: null, A: 60, B: 60, C: 60 }))
      .toThrow('PRECISA_LADO');
  });
});

describe('área e classificação', () => {
  it('área do triângulo 3-4-5', () => {
    expect(area(3, 4, 90)).toBeCloseTo(6);
  });

  it('classifica isósceles obtusângulo', () => {
    const c = classificar([5, 5, 8], [29, 29, 122]);
    expect(c).toContain('isosceles');
    expect(c).toContain('obtusangulo');
  });
});