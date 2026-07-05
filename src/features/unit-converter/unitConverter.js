export const CATEGORIAS = {
  comprimento: {
    base: "m",
    unidades: {
      mm: { fator: 0.001 },
      cm: { fator: 0.01 },
      m: { fator: 1 },
      km: { fator: 1000 },
      in: { fator: 0.0254 },
      ft: { fator: 0.3048 },
      yd: { fator: 0.9144 },
      mi: { fator: 1609.344 },
    },
  },
  massa: {
    base: "kg",
    unidades: {
      mg: { fator: 0.000001 },
      g: { fator: 0.001 },
      kg: { fator: 1 },
      t: { fator: 1000 },
      oz: { fator: 0.0283495 },
      lb: { fator: 0.453592 },
    },
  },
  temperatura: {
    base: "C",
    unidades: {
      C: { fator: null },
      F: { fator: null },
      K: { fator: null },
    },
  },
  volume: {
    base: "l",
    unidades: {
      ml: { fator: 0.001 },
      l: { fator: 1 },
      m3: { fator: 1000 },
      tsp: { fator: 0.00492892 },
      tbsp: { fator: 0.0147868 },
      cup: { fator: 0.236588 },
      floz: { fator: 0.0295735 },
      gal: { fator: 3.78541 },
    },
  },
};

function converterTemperatura(valor, de, para) {
  let celsius;
  switch (de) {
    case "C":
      celsius = valor;
      break;
    case "F":
      celsius = ((valor - 32) * 5) / 9;
      break;
    case "K":
      celsius = valor - 273.15;
      break;
    default:
      throw new Error(`Unidade desconhecida: ${de}`);
  }
  switch (para) {
    case "C":
      return celsius;
    case "F":
      return (celsius * 9) / 5 + 32;
    case "K":
      return celsius + 273.15;
    default:
      throw new Error(`Unidade desconhecida: ${para}`);
  }
}

export function converter(valor, categoriaId, unidadeOrigem, unidadeDestino) {
  if (isNaN(valor)) throw new Error("Valor inválido.");
  if (categoriaId === "temperatura") {
    return converterTemperatura(valor, unidadeOrigem, unidadeDestino);
  }
  const categoria = CATEGORIAS[categoriaId];
  if (!categoria) throw new Error(`Categoria desconhecida: ${categoriaId}`);
  const origem = categoria.unidades[unidadeOrigem];
  const destino = categoria.unidades[unidadeDestino];
  if (!origem || !destino) throw new Error("Unidade desconhecida.");
  return (valor * origem.fator) / destino.fator;
}

export function converterParaTodas(valor, categoriaId, unidadeOrigem) {
  const categoria = CATEGORIAS[categoriaId];
  const resultado = {};
  for (const unidade of Object.keys(categoria.unidades)) {
    resultado[unidade] = converter(valor, categoriaId, unidadeOrigem, unidade);
  }
  return resultado;
}

export function fmtResultado(n) {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 0.001 && abs < 1e9) return parseFloat(n.toPrecision(6)).toString();
  return n.toExponential(4);
}
