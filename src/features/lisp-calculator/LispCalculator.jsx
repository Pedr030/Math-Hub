import { useState } from "react";
import { analisar } from "./pipeline";
import { avaliar } from "./evaluator";
import { ComplexNumber } from "./complexNumber";
import { arvoresIguais } from "./compareTrees";
import Modal from "../../components/ui/Modal";

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
  const [expressao, setExpressao] = useState("");
  const [analise, setAnalise] = useState(null); // { tokens, postfixa, arvore, lisp, variaveis }
  const [valoresVariaveis, setValoresVariaveis] = useState({}); // { x: "3+2j", ... }
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  // --- Comparação com uma segunda expressão (estrutural, não numérica) ---
  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [expressao2, setExpressao2] = useState("");
  const [comparacao, setComparacao] = useState(null); // true | false | null
  const [erro2, setErro2] = useState(null);

  const [mostrarAjuda, setMostrarAjuda] = useState(false);

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
      (nome) =>
        !(nome in valoresVariaveis) || valoresVariaveis[nome].trim() === "",
    );
    if (faltando) return;

    try {
      // Converte cada valor digitado (string) num ComplexNumber de verdade
      const variaveisResolvidas = {};
      for (const nome of analiseAtual.variaveis) {
        variaveisResolvidas[nome] = ComplexNumber.fromString(
          valoresVariaveis[nome],
        );
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
      setErro2("Calcule a primeira expressão antes de comparar.");
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
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-xs uppercase tracking-wide text-brand-500">
          ferramentas/lisp-calculator
        </p>
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label="Como usar esta calculadora"
          title="Como usar esta calculadora"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>
      <h3 className="font-display text-xl font-semibold mb-4">
        Calculadora Científica (LISP)
      </h3>

      <form
        onSubmit={handleCalcular}
        className="flex flex-col sm:flex-row gap-2"
      >
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
                value={valoresVariaveis[nome] ?? ""}
                onChange={(e) =>
                  setValoresVariaveis((prev) => ({
                    ...prev,
                    [nome]: e.target.value,
                  }))
                }
                className="w-24 rounded-md border border-brand-100 px-2 py-1 font-mono text-sm
                           dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100"
              />
            </label>
          ))}
        </div>
      )}

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Erro: {erro}
        </p>
      )}

      {/* Painel de saída: tokens / pós-fixa / LISP / resultado.
          Tudo em font-mono — é a "assinatura visual" do produto: dados
          e expressões matemáticas sempre em monoespaçado. */}
      {analise && !erro && (
        <div className="mt-4 space-y-1.5 rounded-lg bg-slate-50 p-4 font-mono text-sm dark:bg-brand-950/60">
          <p>
            <span className="text-slate-400">tokens:</span>{" "}
            <span className="text-slate-700 dark:text-slate-300">
              [{analise.tokens.join(", ")}]
            </span>
          </p>
          <p>
            <span className="text-slate-400">pós-fixa:</span>{" "}
            <span className="text-slate-700 dark:text-slate-300">
              [{analise.postfixa.join(", ")}]
            </span>
          </p>
          <p>
            <span className="text-slate-400">lisp:</span>{" "}
            <span className="text-brand-500 font-medium">{analise.lisp}</span>
          </p>
          {resultado && (
            <p className="pt-1">
              <span className="text-slate-400">resultado:</span>{" "}
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
          {mostrarComparacao
            ? "— ocultar comparação"
            : "+ comparar com outra expressão"}
        </button>

        {mostrarComparacao && (
          <form
            onSubmit={handleCompararSubmit}
            className="mt-3 flex flex-col sm:flex-row gap-2"
          >
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

        {erro2 && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Erro: {erro2}
          </p>
        )}

        {comparacao !== null && (
          <p className="mt-2 text-sm">
            As expressões são estruturalmente{" "}
            <strong className={comparacao ? "text-green-600" : "text-red-500"}>
              {comparacao ? "equivalentes" : "diferentes"}
            </strong>
            .
          </p>
        )}
      </div>

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title="Como usar a calculadora"
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            Números complexos
          </p>
          <p>
            Use o formato <code className="font-mono text-brand-500">a+bj</code>{" "}
            (o &quot;j&quot; representa a unidade imaginária). Alguns exemplos
            válidos:
          </p>
          <ul className="font-mono text-xs mt-1 space-y-0.5 text-slate-500 dark:text-slate-400">
            <li>3+4j &nbsp;→&nbsp; parte real 3, imaginária 4</li>
            <li>-3+2j &nbsp;→&nbsp; parte real negativa</li>
            <li>7j &nbsp;→&nbsp; só a parte imaginária</li>
            <li>5 &nbsp;→&nbsp; número real (parte imaginária 0)</li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            Operadores e parênteses
          </p>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            + &nbsp; - &nbsp; * &nbsp; / &nbsp; ** (potência) &nbsp; ( ) para
            controlar a ordem
          </p>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            Funções
          </p>
          <ul className="font-mono text-xs space-y-0.5 text-slate-500 dark:text-slate-400">
            <li>conj(x) &nbsp;→&nbsp; conjugado de x</li>
            <li>
              raiz(x) &nbsp;→&nbsp; raiz quadrada de x (funciona com negativos)
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            Variáveis
          </p>
          <p>
            Qualquer letra que não seja{" "}
            <code className="font-mono text-brand-500">conj</code>,{" "}
            <code className="font-mono text-brand-500">raiz</code> ou{" "}
            <code className="font-mono text-brand-500">j</code> é tratada como
            variável — um campo pra preencher o valor aparece automaticamente
            antes de calcular. Exemplo:{" "}
            <code className="font-mono text-brand-500">a + b * 2</code>.
          </p>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            O que cada linha do resultado significa
          </p>
          <ul className="space-y-0.5">
            <li>
              <span className="font-mono text-xs text-slate-400">tokens</span> —
              a expressão quebrada em pedaços
            </li>
            <li>
              <span className="font-mono text-xs text-slate-400">pós-fixa</span>{" "}
              — ordem usada internamente pra calcular
            </li>
            <li>
              <span className="font-mono text-xs text-slate-400">lisp</span> — a
              mesma expressão em notação prefixa, ex: (+ 3 4j)
            </li>
            <li>
              <span className="font-mono text-xs text-slate-400">
                resultado
              </span>{" "}
              — o valor final
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            Comparar expressões
          </p>
          <p>
            O botão &quot;comparar com outra expressão&quot; verifica se duas
            expressões têm a <strong>mesma estrutura</strong> (mesmos operadores
            e na mesma ordem) — não se dão o mesmo resultado numérico.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default LispCalculator;
