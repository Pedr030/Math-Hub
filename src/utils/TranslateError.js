// Mapeia padrões de erro (em português, que é como a lógica os lança)
// para chaves de i18n. Assim os arquivos de lógica ficam intactos.
const MAPA_ERROS = [
  { pattern: /Parênteses desbalanceados/, key: "erros.parenDesbalanceados" },
  { pattern: /Não pode dividir por zero/, key: "erros.divisaoPorZero" },
  { pattern: /função sem operando/, key: "erros.funcaoSemOperando" },
  {
    pattern: /operador sem operandos suficientes/,
    key: "erros.operadorSemOperandos",
  },
  {
    pattern: /Expressão malformada: resultado inválido/,
    key: "erros.resultadoInvalido",
  },
  {
    pattern: /Não pode elevar zero a potência negativa/,
    key: "erros.zeroPotenciaNegativa",
  },
];

export function traduzirErro(mensagem, t) {
  for (const { pattern, key } of MAPA_ERROS) {
    if (pattern.test(mensagem)) return t(key);
  }
  // Erros dinâmicos (ex: "Variável 'x' não definida") ficam como estão —
  // são raros e suficientemente informativos mesmo em português.
  return mensagem;
}
