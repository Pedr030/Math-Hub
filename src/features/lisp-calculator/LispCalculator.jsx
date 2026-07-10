import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { analisar } from "./pipeline";
import { avaliar } from "./evaluator";
import { ComplexNumber } from "./complexNumber";
import { arvoresIguais } from "./compareTrees";
import { avaliarExpressao, fmtNormal, traduzirErroNormal } from "./normalCalc";
import { traduzirErro } from "../../utils/TranslateError";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import OutputPanel from "../../components/ui/OutputPanel";

// ─── Modo Normal ─────────────────────────────────────────────────────────────

const BOTOES = [
  ["C", "(", ")", "←", "÷"],
  ["7", "8", "9", null, "×"],
  ["4", "5", "6", null, "-"],
  ["1", "2", "3", null, "+"],
  ["+/-", "0", ".", null, "="],
];

const BOTOES_CIENTIFICOS = [
  ["sin", "cos", "tan", "log", "ln"],
  ["π", "e", "x²", "√", "1/x"],
];

function BotaoCalc({ label, onClick, tipo = "normal", disabled = false }) {
  const base =
    "rounded-lg font-mono text-sm font-medium transition-colors select-none";
  const estilos = {
    normal:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-brand-900 dark:text-slate-200 dark:hover:bg-brand-800",
    operador:
      "bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-800 dark:text-brand-200 dark:hover:bg-brand-700",
    igual: "bg-brand-500 text-white hover:bg-brand-600",
    limpar:
      "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900",
    cientifico:
      "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-brand-950 dark:text-slate-400 dark:hover:bg-brand-900 text-xs",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${estilos[tipo]} py-3 px-2
        ${disabled ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}`}
    >
      {label}
    </button>
  );
}

function ModoNormal({ t }) {
  const [display, setDisplay] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [acabouDeCalcular, setAcabouDeCalcular] = useState(false);

  function calcular(expr = display) {
    if (!expr) return;
    setErro(null);
    try {
      const res = avaliarExpressao(expr);
      setResultado(res);
      setAcabouDeCalcular(true);
    } catch (err) {
      setErro(err.message);
      setResultado(null);
    }
  }

  function handleBotao(label) {
    setErro(null);

    if (label === "C") {
      setDisplay("");
      setResultado(null);
      setAcabouDeCalcular(false);
      return;
    }

    if (label === "←") {
      setDisplay((prev) => prev.slice(0, -1));
      setAcabouDeCalcular(false);
      return;
    }

    if (label === "=") {
      calcular();
      return;
    }

    if (label === "+/-") {
      setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
      return;
    }

    // Funções científicas
    if (label === "x²") {
      if (acabouDeCalcular && resultado !== null) {
        const expr = `(${fmtNormal(resultado)})**2`;
        setDisplay(expr);
        setResultado(null);
        setAcabouDeCalcular(false);
        calcular(expr);
      } else {
        setDisplay((prev) => `(${prev})**2`);
      }
      return;
    }
    if (label === "√") {
      setDisplay((prev) => `sqrt(${prev || ""})`);
      return;
    }
    if (label === "1/x") {
      setDisplay((prev) => `1/(${prev || ""})`);
      return;
    }
    if (label === "sin") {
      setDisplay((prev) => `sin(${prev || ""})`);
      return;
    }
    if (label === "cos") {
      setDisplay((prev) => `cos(${prev || ""})`);
      return;
    }
    if (label === "tan") {
      setDisplay((prev) => `tan(${prev || ""})`);
      return;
    }
    if (label === "log") {
      setDisplay((prev) => `log(${prev || ""})`);
      return;
    }
    if (label === "ln") {
      setDisplay((prev) => `ln(${prev || ""})`);
      return;
    }
    if (label === "π") {
      setDisplay((prev) => prev + "π");
      return;
    }
    if (label === "e") {
      setDisplay((prev) => prev + "e");
      return;
    }

    // Se acabou de calcular e começa novo número, limpa o display
    if (acabouDeCalcular && /[0-9.]/.test(label)) {
      setDisplay(label);
      setResultado(null);
      setAcabouDeCalcular(false);
      return;
    }
    // Se acabou de calcular e aperta operador, continua com o resultado
    if (acabouDeCalcular && resultado !== null) {
      setDisplay(fmtNormal(resultado) + label);
      setResultado(null);
      setAcabouDeCalcular(false);
      return;
    }

    setDisplay((prev) => prev + label);
  }

  function tipoBotao(label) {
    if (label === "=") return "igual";
    if (label === "C") return "limpar";
    if (["÷", "×", "-", "+", "(", ")", "←"].includes(label)) return "operador";
    return "normal";
  }
  const precisaDisplay = ["sin", "cos", "tan", "log", "ln", "x²", "√", "1/x"];
  const displayVazio = display.trim() === "";

  return (
    <div className="space-y-3">
      {/* Display */}
      <div className="rounded-xl bg-slate-50 dark:bg-brand-950/60 p-4 min-h-[80px] flex flex-col items-end justify-end">
        <p className="font-mono text-slate-400 dark:text-slate-600 text-xs truncate max-w-full text-right mb-1">
          {display || " "}
        </p>
        <p
          className={`font-mono font-semibold text-2xl ${
            erro
              ? "text-red-500 text-sm"
              : resultado !== null
                ? "text-brand-600 dark:text-brand-300"
                : "text-slate-400"
          }`}
        >
          {erro
            ? traduzirErroNormal(erro, t)
            : resultado !== null
              ? fmtNormal(resultado)
              : "0"}
        </p>
      </div>

      {/* Botões científicos */}
      <div className="grid grid-cols-5 gap-1">
        {BOTOES_CIENTIFICOS.flat().map((label) => (
          <BotaoCalc
            key={label}
            label={label}
            onClick={() => handleBotao(label)}
            tipo="cientifico"
            disabled={precisaDisplay.includes(label) && displayVazio}
          />
        ))}
      </div>

      {/* Botões principais */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
      >
        {BOTOES.map((linha, i) =>
          linha.map((label, j) =>
            label === null ? (
              <div key={`${i}-${j}`} />
            ) : (
              <BotaoCalc
                key={label + i + j}
                label={label}
                onClick={() => handleBotao(label)}
                tipo={tipoBotao(label)}
              />
            ),
          ),
        )}
      </div>

      {/* Campo de texto para quem prefere digitar */}
      <div className="flex gap-2 mt-1">
        <Input
          value={display}
          onChange={(e) => {
            setDisplay(e.target.value);
            setAcabouDeCalcular(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && calcular()}
          placeholder={t("calc.normal.placeholder")}
          className="font-mono"
        />
      </div>
    </div>
  );
}

// ─── Modo LISP ───────────────────────────────────────────────────────────────

function ModoLisp({ t }) {
  const [expressao, setExpressao] = useState("");
  const [analise, setAnalise] = useState(null);
  const [valoresVariaveis, setValoresVariaveis] = useState({});
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [expressao2, setExpressao2] = useState("");
  const [comparacao, setComparacao] = useState(null);
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

    const faltando = analiseAtual.variaveis.some(
      (nome) =>
        !(nome in valoresVariaveis) || valoresVariaveis[nome].trim() === "",
    );
    if (faltando) return;

    try {
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
      setErro2(t("tools.lispCalculator.erroComparacao"));
      return;
    }
    try {
      const analise2 = analisar(expressao2);
      setComparacao(arvoresIguais(analise.arvore, analise2.arvore));
    } catch (err) {
      setErro2(err.message);
    }
  }

  const outputRows =
    analise && !erro
      ? [
          {
            label: t("tools.lispCalculator.output.tokens"),
            value: `[${analise.tokens.join(", ")}]`,
          },
          {
            label: t("tools.lispCalculator.output.posfixa"),
            value: `[${analise.postfixa.join(", ")}]`,
          },
          {
            label: t("tools.lispCalculator.output.lisp"),
            value: analise.lisp,
            highlight: true,
          },
          ...(resultado
            ? [
                {
                  label: t("tools.lispCalculator.output.resultado"),
                  value: resultado.toString(),
                  large: true,
                },
              ]
            : []),
        ]
      : [];

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleCalcular}
        className="flex flex-col sm:flex-row gap-2"
      >
        <Input
          value={expressao}
          onChange={(e) => setExpressao(e.target.value)}
          placeholder={t("tools.lispCalculator.placeholder")}
        />
        <Button type="submit">{t("tools.lispCalculator.calcular")}</Button>
      </form>

      {analise && analise.variaveis.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {analise.variaveis.map((nome) => (
            <label key={nome} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-brand-500">{nome} =</span>
              <Input
                placeholder="ex: 3+2j"
                value={valoresVariaveis[nome] ?? ""}
                onChange={(e) =>
                  setValoresVariaveis((prev) => ({
                    ...prev,
                    [nome]: e.target.value,
                  }))
                }
                className="w-24 flex-none"
              />
            </label>
          ))}
        </div>
      )}

      {erro && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {traduzirErro(erro, t)}
        </p>
      )}

      <OutputPanel rows={outputRows} />

      <div className="border-t border-brand-100 pt-4 dark:border-brand-900">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setMostrarComparacao((v) => !v)}
        >
          {mostrarComparacao
            ? t("tools.lispCalculator.ocultarComparacao")
            : t("tools.lispCalculator.mostrarComparacao")}
        </Button>

        {mostrarComparacao && (
          <form
            onSubmit={handleCompararSubmit}
            className="mt-3 flex flex-col sm:flex-row gap-2"
          >
            <Input
              value={expressao2}
              onChange={(e) => setExpressao2(e.target.value)}
              placeholder={t("tools.lispCalculator.placeholderComparacao")}
            />
            <Button type="submit" variant="secondary">
              {t("tools.lispCalculator.comparar")}
            </Button>
          </form>
        )}

        {erro2 && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {t("common.erroPre")} {traduzirErro(erro2, t)}
          </p>
        )}

        {comparacao !== null && (
          <p className="mt-2 text-sm">
            {t("tools.lispCalculator.estruturalmente")}{" "}
            <strong className={comparacao ? "text-green-600" : "text-red-500"}>
              {comparacao
                ? t("tools.lispCalculator.equivalentes")
                : t("tools.lispCalculator.diferentes")}
            </strong>
            .
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

function LispCalculator() {
  const { t } = useTranslation();
  const [modoLisp, setModoLisp] = useState(false);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  return (
    <ToolCard>
      {/* Cabeçalho com toggle e botão de ajuda */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setModoLisp((v) => !v)}
          className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition-colors border
            ${
              modoLisp
                ? "bg-brand-500 text-white border-brand-500"
                : "border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
            }`}
        >
          {modoLisp ? "← Normal" : "LISP →"}
        </button>

        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.lispCalculator.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      {/* Conteúdo do modo ativo */}
      {modoLisp ? <ModoLisp t={t} /> : <ModoNormal t={t} />}

      {/* Modal de ajuda — muda conforme o modo ativo */}
      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={
          modoLisp
            ? t("tools.lispCalculator.ajuda.titulo")
            : t("calc.normal.ajuda.titulo")
        }
      >
        {modoLisp ? (
          <>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("tools.lispCalculator.ajuda.complexos.titulo")}
              </p>
              <p>{t("tools.lispCalculator.ajuda.complexos.desc")}</p>
              <ul className="font-mono text-xs mt-1 space-y-0.5 text-slate-500 dark:text-slate-400">
                <li>{t("tools.lispCalculator.ajuda.complexos.ex1")}</li>
                <li>{t("tools.lispCalculator.ajuda.complexos.ex2")}</li>
                <li>{t("tools.lispCalculator.ajuda.complexos.ex3")}</li>
                <li>{t("tools.lispCalculator.ajuda.complexos.ex4")}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("tools.lispCalculator.ajuda.operadores.titulo")}
              </p>
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {t("tools.lispCalculator.ajuda.operadores.desc")}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("tools.lispCalculator.ajuda.funcoes.titulo")}
              </p>
              <ul className="font-mono text-xs space-y-0.5 text-slate-500 dark:text-slate-400">
                <li>{t("tools.lispCalculator.ajuda.funcoes.conj")}</li>
                <li>{t("tools.lispCalculator.ajuda.funcoes.raiz")}</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("calc.normal.ajuda.uso.titulo")}
              </p>
              <p>{t("calc.normal.ajuda.uso.desc")}</p>
            </div>

            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("calc.normal.ajuda.funcoes.titulo")}
              </p>
              <ul className="font-mono text-xs space-y-0.5 text-slate-500 dark:text-slate-400">
                {t("calc.normal.ajuda.funcoes.lista", {
                  returnObjects: true,
                }).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("calc.normal.ajuda.ordemFuncoes.titulo")}
              </p>
              <p>{t("calc.normal.ajuda.ordemFuncoes.desc")}</p>
            </div>

            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                {t("calc.normal.ajuda.lisp.titulo")}
              </p>
              <p>{t("calc.normal.ajuda.lisp.desc")}</p>
            </div>
          </>
        )}
      </Modal>
    </ToolCard>
  );
}

export default LispCalculator;
