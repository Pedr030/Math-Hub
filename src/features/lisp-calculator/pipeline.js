import { tokenizar } from './tokenizer';
import { paraPosfixa, extrairVariaveis } from './parser';
import { criarDePosfixa } from './expressionTree';
import { paraLisp } from './lispNotation';

/**
 * Roda os 4 primeiros passos do pipeline (tudo que NÃO depende de
 * valores de variáveis ainda): tokenizar -> pós-fixa -> árvore -> LISP.
 * Equivalente à primeira metade de processar_expressao() em operacoes.py
 * (antes do loop que pedia valores via input()).
 */
export function analisar(expressao) {
  const tokens = tokenizar(expressao);
  const postfixa = paraPosfixa(tokens);
  const arvore = criarDePosfixa(postfixa);
  const lisp = paraLisp(arvore);
  const variaveis = extrairVariaveis(tokens);

  return { tokens, postfixa, arvore, lisp, variaveis };
}
