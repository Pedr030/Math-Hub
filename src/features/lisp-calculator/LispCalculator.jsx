import { useState } from "react";
import { analisar } from "./pipeline";
import { avaliar } from "./evaluator";
import { ComplexNumber } from "./complexNumber";
import { arvoresIguais } from "./compareTrees";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import OutputPanel from "../../components/ui/OutputPanel";
import { useTranslation } from "react-i18next";
import { traduzirErro } from "../../utils/TranslateError";

function LispCalculator() {
  const [expressao, setExpressao] = useState("");
  const [analise, setAnalise] = useState(null);
  const [valoresVariaveis, setValoresVariaveis] = useState({});
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [expressao2, setExpressao2] = useState("");
  const [comparacao, setComparacao] = useState(null);
  const [erro2, setErro2] = useState(null);

  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  const { t } = useTranslation();

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
    <ToolCard>
      {/* Botão de ajuda — cabeçalho agora é responsabilidade do ToolPage */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.lispCalculator.ajuda.titulo")}
          title={t("tools.lispCalculator.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                   text-xs font-semibold text-brand-500 hover:bg-brand-50
                   dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

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
        <div className="mt-4 flex flex-wrap gap-3">
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
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {traduzirErro(erro, t)}
        </p>
      )}

      <OutputPanel rows={outputRows} />

      <div className="mt-5 border-t border-brand-100 pt-4 dark:border-brand-900">
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

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.lispCalculator.ajuda.titulo")}
      >
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

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.lispCalculator.ajuda.variaveis.titulo")}
          </p>
          <p>{t("tools.lispCalculator.ajuda.variaveis.desc")}</p>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.lispCalculator.ajuda.output.titulo")}
          </p>
          <ul className="space-y-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
            <li>{t("tools.lispCalculator.ajuda.output.tokens")}</li>
            <li>{t("tools.lispCalculator.ajuda.output.posfixa")}</li>
            <li>{t("tools.lispCalculator.ajuda.output.lisp")}</li>
            <li>{t("tools.lispCalculator.ajuda.output.resultado")}</li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.lispCalculator.ajuda.comparacao.titulo")}
          </p>
          <p>{t("tools.lispCalculator.ajuda.comparacao.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default LispCalculator;
