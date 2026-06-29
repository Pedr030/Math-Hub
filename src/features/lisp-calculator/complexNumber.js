/**
 * Implementação própria de números complexos e suas operações.
 * Port direto de complexo.py — mesma lógica matemática, sintaxe JS.
 *
 * Diferença chave Python -> JS: Python permite sobrecarregar operadores
 * (você pode fazer a + b se a classe implementar __add__). JS não tem
 * essa flexibilidade nativa, então toda operação é um método explícito:
 * a.somar(b) em vez de a + b. É mais verboso, mas também mais explícito
 * sobre o que está acontecendo.
 */
export class ComplexNumber {
  constructor(real, imag) {
    this.real = real; // parte real (a em a+bi)
    this.imag = imag; // parte imaginária (b em a+bi)
  }

  somar(outro) {
    // (a+bi) + (c+di) = (a+c) + (b+d)i
    return new ComplexNumber(this.real + outro.real, this.imag + outro.imag);
  }

  subtrair(outro) {
    // (a+bi) - (c+di) = (a-c) + (b-d)i
    return new ComplexNumber(this.real - outro.real, this.imag - outro.imag);
  }

  multiplicar(outro) {
    // (a+bi) * (c+di) = (ac-bd) + (ad+bc)i
    const real = this.real * outro.real - this.imag * outro.imag;
    const imag = this.real * outro.imag + this.imag * outro.real;
    return new ComplexNumber(real, imag);
  }

  dividir(outro) {
    if (outro.real === 0 && outro.imag === 0) {
      throw new Error('Não pode dividir por zero');
    }

    // Truque: multiplica numerador e denominador pelo conjugado do denominador
    const conjugadoOutro = new ComplexNumber(outro.real, -outro.imag);
    const numerador = this.multiplicar(conjugadoOutro);
    const denominador = outro.real * outro.real + outro.imag * outro.imag;

    return new ComplexNumber(numerador.real / denominador, numerador.imag / denominador);
  }

  potencia(exp) {
    if (exp === 0) return new ComplexNumber(1, 0);
    if (exp === 1) return new ComplexNumber(this.real, this.imag);
    if (exp === 2) return this.multiplicar(this);

    if (Number.isInteger(exp)) {
      let resultado = new ComplexNumber(1, 0);
      for (let i = 0; i < Math.abs(exp); i++) {
        resultado = resultado.multiplicar(this);
      }

      if (exp < 0) {
        if (this.real === 0 && this.imag === 0) {
          throw new Error('Não pode elevar zero a potência negativa');
        }
        resultado = new ComplexNumber(1, 0).dividir(resultado);
      }

      return resultado;
    }

    // Expoente real (não-inteiro): usa forma polar
    const r = Math.sqrt(this.real * this.real + this.imag * this.imag);
    const theta = Math.atan2(this.imag, this.real);

    const novoR = Math.pow(r, exp);
    const novoTheta = theta * exp;

    return new ComplexNumber(novoR * Math.cos(novoTheta), novoR * Math.sin(novoTheta));
  }

  conjugado() {
    // (a+bi) -> (a-bi)
    return new ComplexNumber(this.real, -this.imag);
  }

  raizQuadrada() {
    const r = Math.sqrt(this.real * this.real + this.imag * this.imag);
    const realResultado = Math.sqrt((r + this.real) / 2);
    const imagAbs = Math.sqrt((r - this.real) / 2);

    return new ComplexNumber(realResultado, this.imag >= 0 ? imagAbs : -imagAbs);
  }

  // toString é um método especial em JS: qualquer lugar que tente converter
  // o objeto pra texto (template literals, String(obj), concatenação com +)
  // chama esse método automaticamente — é o equivalente direto do __str__
  // do Python.
  toString() {
    const sinal = this.imag >= 0 ? '+' : '';
    return `(${this.real}${sinal}${this.imag}j)`;
  }

  // Equivalente ao @staticmethod de_string do Python.
  // "static" em JS funciona igual: chama-se ComplexNumber.fromString(...),
  // sem precisar de uma instância.
  static fromString(texto) {
    const limpo = texto.replace(/\s/g, '').replace(/[()]/g, '');

    if (!limpo.includes('j')) {
      const real = Number(limpo);
      if (Number.isNaN(real)) throw new Error(`Número inválido: ${texto}`);
      return new ComplexNumber(real, 0);
    }

    if (limpo === 'j') return new ComplexNumber(0, 1);
    if (limpo === '-j') return new ComplexNumber(0, -1);

    const posMais = limpo.indexOf('+');
    const posMenos = limpo.indexOf('-', 1); // ignora sinal de abertura na posição 0

    let real;
    let imag;

    if (posMais > 0) {
      const partes = [limpo.slice(0, posMais), limpo.slice(posMais + 1)];
      real = Number(partes[0]);
      const imagStr = partes[1].replace('j', '');
      imag = imagStr ? Number(imagStr) : 1;
    } else if (posMenos > 0) {
      real = Number(limpo.slice(0, posMenos));
      const imagStr = limpo.slice(posMenos + 1).replace('j', '');
      imag = imagStr ? -Number(imagStr) : -1;
    } else {
      const imagStr = limpo.replace('j', '');
      if (imagStr === '' || imagStr === '+') imag = 1;
      else if (imagStr === '-') imag = -1;
      else imag = Number(imagStr);
      real = 0;
    }

    if (Number.isNaN(real) || Number.isNaN(imag)) {
      throw new Error(`Número complexo inválido: ${texto}`);
    }

    return new ComplexNumber(real, imag);
  }
}
