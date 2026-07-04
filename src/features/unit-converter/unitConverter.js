/**
 * Conversão entre unidades de medida.
 * Estratégia: todas as unidades são convertidas pra uma "unidade base"
 * e depois pra unidade destino. Temperatura é exceção — usa fórmulas diretas.
 */

// Cada categoria tem uma unidade base (fator = 1.0)
// e todas as outras expressas em relação a ela.
export const CATEGORIAS = {
  comprimento: {
    label: "comprimento",
    base: "m",
    unidades: {
      mm: { fator: 0.001, label: "Milímetro (mm)" },
      cm: { fator: 0.01, label: "Centímetro (cm)" },
      m: { fator: 1, label: "Metro (m)" },
      km: { fator: 1000, label: "Quilômetro (km)" },
      in: { fator: 0.0254, label: "Polegada (in)" },
      ft: { fator: 0.3048, label: "Pé (ft)" },
      yd: { fator: 0.9144, label: "Jarda (yd)" },
      mi: { fator: 1609.344, label: "Milha (mi)" },
    },
  },
  massa: {
    label: "massa",
    base: "kg",
    unidades: {
      mg: { fator: 0.000001, label: "Miligrama (mg)" },
      g: { fator: 0.001, label: "Grama (g)" },
      kg: { fator: 1, label: "Quilograma (kg)" },
      t: { fator: 1000, label: "Tonelada (t)" },
      oz: { fator: 0.0283495, label: "Onça (oz)" },
      lb: { fator: 0.453592, label: "Libra (lb)" },
    },
  },
  temperatura: {
    label: "temperatura",
    base: "C",
    unidades: {
      C: { fator: null, label: "Celsius (°C)" },
      F: { fator: null, label: "Fahrenheit (°F)" },
      K: { fator: null, label: "Kelvin (K)" },
    },
  },
  volume: {
    label: "volume",
    base: "l",
    unidades: {
      ml: { fator: 0.001, label: "Mililitro (ml)" },
      l: { fator: 1, label: "Litro (l)" },
      m3: { fator: 1000, label: "Metro cúbico (m³)" },
      tsp: { fator: 0.00492892, label: "Colher de chá (tsp)" },
      tbsp: { fator: 0.0147868, label: "Colher de sopa (tbsp)" },
      cup: { fator: 0.236588, label: "Xícara (cup)" },
      floz: { fator: 0.0295735, label: "Fl oz (fl oz)" },
      gal: { fator: 3.78541, label: "Galão (gal)" },
    },
  },
};

// Conversões de temperatura (fórmulas diretas — não usam fator linear)
function converterTemperatura(valor, de, para) {
  // Primeiro converte pra Celsius como base intermediária
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

  // Depois converte de Celsius para o destino
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

/**
 * Converte um valor de uma unidade para outra dentro da mesma categoria.
 */
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

  // valor → base → destino
  return (valor * origem.fator) / destino.fator;
}

/**
 * Converte para todas as unidades da categoria de uma vez.
 */
export function converterParaTodas(valor, categoriaId, unidadeOrigem) {
  const categoria = CATEGORIAS[categoriaId];
  const resultado = {};

  for (const unidade of Object.keys(categoria.unidades)) {
    resultado[unidade] = converter(valor, categoriaId, unidadeOrigem, unidade);
  }

  return resultado;
}

// Formata o resultado — evita notação científica desnecessária
export function fmtResultado(n) {
  if (n === 0) return "0";
  const abs = Math.abs(n);

  if (abs >= 0.001 && abs < 1e9) {
    // Faixa "normal" — usa até 6 casas significativas
    return parseFloat(n.toPrecision(6)).toString();
  }

  // Fora da faixa normal — notação científica
  return n.toExponential(4);
}
