/**
 * Lógica de cálculo de juros simples e compostos.
 * Funções puras — sem nenhuma dependência de React ou UI.
 */

/**
 * Calcula a evolução período a período para juros simples.
 * M = C * (1 + i * t)
 */
export function calcularSimples(capital, taxaPercent, periodos) {
  const taxa = taxaPercent / 100;
  const tabela = [];

  for (let t = 1; t <= periodos; t++) {
    const montante = capital * (1 + taxa * t);
    const juros = montante - capital;
    tabela.push({ periodo: t, montante, juros });
  }

  return {
    montanteFinal: tabela[tabela.length - 1].montante,
    jurosTotais: tabela[tabela.length - 1].juros,
    tabela,
  };
}

/**
 * Calcula a evolução período a período para juros compostos.
 * M = C * (1 + i)^t
 */
export function calcularComposto(capital, taxaPercent, periodos) {
  const taxa = taxaPercent / 100;
  const tabela = [];

  for (let t = 1; t <= periodos; t++) {
    const montante = capital * Math.pow(1 + taxa, t);
    const juros = montante - capital;
    tabela.push({ periodo: t, montante, juros });
  }

  return {
    montanteFinal: tabela[tabela.length - 1].montante,
    jurosTotais: tabela[tabela.length - 1].juros,
    tabela,
  };
}
