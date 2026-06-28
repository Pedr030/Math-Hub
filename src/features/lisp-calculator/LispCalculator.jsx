import { useState } from 'react';
import { analisar } from './pipeline';
import { avaliar } from './evaluator';
import { ComplexNumber } from './complexNumber';
import { arvoresIguais } from './compareTrees';

/**
 * Calculadora científica de números complexos.
 *
 * Diferença de fluxo em relação à versão CLI original: lá, o programa
 * parava e chamava input() pra cada variável encontrada (bloqueante).
 * Numa página web não existe "parar a execução" — em vez disso,
 * detectamos as variáveis ANTES de calcular e renderizamos um campo
 * para cada uma. O botão "Calcular" só fecha a conta quando todos os
 * campos têm um valor válido.
 */
function LispCalculator() {
  const [expressao, setExpressao] = useState('');
  const [analise, setAnalise] = useState(null); // { tokens, postfixa, arvore, lisp, variaveis }
  const [valoresVariaveis, setValoresVariaveis] = useState({}); // { x: "3+2j", ... }
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  // --- Comparação com uma segunda expressão (estrutural, não numérica) ---
  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [expressao2, setExpressao2] = useState('');
  const [comparacao, setComparacao] = useState(null); // true | false | null
  const [erro2, setErro2] = useState(null);

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    let analiseAtual;
    try {
      analiseAtual = analisar(expressao);
      setAnalise(analiseAtual);
    } catch (err) {
      setAnalise(null);
      setErro(err.message);
      return;
    }

    // Ainda faltam valores de variável? Para por aqui e deixa os
    // campos aparecerem na tela (eles são renderizados a partir de
    // analiseAtual.variaveis logo abaixo, no JSX).
    const faltando = analiseAtual.variaveis.some(
      (nome) => !(nome in valoresVariaveis) || valoresVariaveis[nome].trim() === ''
    );
    if (faltando) return;

    try {
      // Converte cada valor digitado (string) num ComplexNumber de verdade
      const variaveisResolvidas = {};
      for (const nome of analiseAtual.variaveis) {
        variaveisResolvidas[nome] = ComplexNumber.fromString(valoresVariaveis[nome]);
      }

      setResultado(avaliar(analiseAtual.arvore, variaveisResolvidas));
    } catch (err) {
      setErro(err.message);
    }
  }

  function handleCompararSubmit(e) {
    e.preventDefault();
    setErro2(null);
    setComparacao(null);

    if (!analise) {
      setErro2('Calcule a primeira expressão antes de comparar.');
      return;
    }

    try {
      const analise2 = analisar(expressao2);
      setComparacao(arvoresIguais(analise.arvore, analise2.arvore));
    } catch (err) {
      setErro2(err.message);
    }
  }

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm dark:border-brand-900 dark:bg-brand-900/30">
      <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-1">
        ferramentas/lisp-calculator
      </p>
      <h3 className="font-display text-xl font-semibold mb-4">
        Calculadora Científica (LISP)
      </h3>

      <form onSubmit={handleCalcular} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={expressao}
          onChange={(e) => setExpressao(e.target.value)}
          placeholder="Ex: (3+4j) * conj(3+4j)"
          className="flex-1 rounded-lg border border-brand-100 bg-white px-3 py-2 font-mono text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-400
                     dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white
                     hover:bg-brand-600 transition-colors"
        >
          Calcular
        </button>
      </form>

      {/* Campos de variável aparecem só quando o parser encontra alguma */}
      {analise && analise.variaveis.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {analise.variaveis.map((nome) => (
            <label key={nome} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-brand-500">{nome} =</span>
              <input
                type="text"
                placeholder="ex: 3+2j"
                value={valoresVariaveis[nome] ?? ''}
                onChange={(e) =>
                  setValoresVariaveis((prev) => ({ ...prev, [nome]: e.target.value }))
                }
                className="w-24 rounded-md border border-brand-100 px-2 py-1 font-mono text-sm
                           dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100"
              />
            </label>
          ))}
        </div>
      )}

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">Erro: {erro}</p>
      )}

      {/* Painel de saída: tokens / pós-fixa / LISP / resultado.
          Tudo em font-mono — é a "assinatura visual" do produto: dados
          e expressões matemáticas sempre em monoespaçado. */}
      {analise && !erro && (
        <div className="mt-4 space-y-1.5 rounded-lg bg-slate-50 p-4 font-mono text-sm dark:bg-brand-950/60">
          <p>
            <span className="text-slate-400">tokens:</span>{' '}
            <span className="text-slate-700 dark:text-slate-300">[{analise.tokens.join(', ')}]</span>
          </p>
          <p>
            <span className="text-slate-400">pós-fixa:</span>{' '}
            <span className="text-slate-700 dark:text-slate-300">[{analise.postfixa.join(', ')}]</span>
          </p>
          <p>
            <span className="text-slate-400">lisp:</span>{' '}
            <span className="text-brand-500 font-medium">{analise.lisp}</span>
          </p>
          {resultado && (
            <p className="pt-1">
              <span className="text-slate-400">resultado:</span>{' '}
              <span className="text-lg font-semibold text-brand-600 dark:text-brand-300">
                {resultado.toString()}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Comparação estrutural — recurso "bônus" herdado do compare.py */}
      <div className="mt-5 border-t border-brand-100 pt-4 dark:border-brand-900">
        <button
          type="button"
          onClick={() => setMostrarComparacao((v) => !v)}
          className="text-sm text-brand-500 hover:underline"
        >
          {mostrarComparacao ? '— ocultar comparação' : '+ comparar com outra expressão'}
        </button>

        {mostrarComparacao && (
          <form onSubmit={handleCompararSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={expressao2}
              onChange={(e) => setExpressao2(e.target.value)}
              placeholder="Ex: conj(3+4j) * (3+4j)"
              className="flex-1 rounded-lg border border-brand-100 bg-white px-3 py-2 font-mono text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-400
                         dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100"
            />
            <button
              type="submit"
              className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-medium text-brand-600
                         hover:bg-brand-50 transition-colors dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
            >
              Comparar
            </button>
          </form>
        )}

        {erro2 && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Erro: {erro2}</p>}

        {comparacao !== null && (
          <p className="mt-2 text-sm">
            As expressões são estruturalmente{' '}
            <strong className={comparacao ? 'text-green-600' : 'text-red-500'}>
              {comparacao ? 'equivalentes' : 'diferentes'}
            </strong>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export default LispCalculator;
