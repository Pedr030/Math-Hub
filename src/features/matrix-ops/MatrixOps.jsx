import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  criarMatrizVazia,
  parseMatriz,
  somar,
  subtrair,
  multiplicar,
  transposta,
  determinante,
} from "./matrixOps";
import MatrixInput from "./MatrixInput";
import MatrixDisplay from "./MatrixDisplay";
import Button from "../../components/ui/Button";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

const OPERACOES = [
  "somar",
  "subtrair",
  "multiplicar",
  "transposta",
  "determinante",
];
const OPERACOES_UMA_MATRIZ = ["transposta", "determinante"];

function MatrixOps() {
  const { t } = useTranslation();
  const [tamanho, setTamanho] = useState(2);
  const [operacao, setOperacao] = useState("somar");
  const [matrizA, setMatrizA] = useState(criarMatrizVazia(2));
  const [matrizB, setMatrizB] = useState(criarMatrizVazia(2));
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  const precisaDuasMatrizes = !OPERACOES_UMA_MATRIZ.includes(operacao);

  function handleTrocarTamanho(novoTamanho) {
    setTamanho(novoTamanho);
    setMatrizA(criarMatrizVazia(novoTamanho));
    setMatrizB(criarMatrizVazia(novoTamanho));
    setResultado(null);
    setErro(null);
  }

  function handleChangeA(i, j, val) {
    setMatrizA((prev) => {
      const nova = prev.map((l) => [...l]);
      nova[i][j] = val;
      return nova;
    });
  }

  function handleChangeB(i, j, val) {
    setMatrizB((prev) => {
      const nova = prev.map((l) => [...l]);
      nova[i][j] = val;
      return nova;
    });
  }

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    try {
      const a = parseMatriz(matrizA);
      const b = precisaDuasMatrizes ? parseMatriz(matrizB) : null;

      let res;
      switch (operacao) {
        case "somar":
          res = { tipo: "matriz", valor: somar(a, b) };
          break;
        case "subtrair":
          res = { tipo: "matriz", valor: subtrair(a, b) };
          break;
        case "multiplicar":
          res = { tipo: "matriz", valor: multiplicar(a, b) };
          break;
        case "transposta":
          res = { tipo: "matriz", valor: transposta(a) };
          break;
        case "determinante":
          res = { tipo: "escalar", valor: determinante(a) };
          break;
        default:
          throw new Error("Operação desconhecida");
      }

      setResultado(res);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.matrixOps.ajuda.titulo")}
          title={t("tools.matrixOps.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      {/* Toggle de tamanho */}
      <div className="flex gap-2 mb-4">
        {[2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleTrocarTamanho(n)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium font-mono transition-colors
              ${
                tamanho === n
                  ? "bg-brand-500 text-white"
                  : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
              }`}
          >
            {n}×{n}
          </button>
        ))}
      </div>

      {/* Toggle de operação */}
      <div className="flex flex-wrap gap-2 mb-5">
        {OPERACOES.map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => {
              setOperacao(op);
              setResultado(null);
              setErro(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
              ${
                operacao === op
                  ? "bg-brand-500 text-white"
                  : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
              }`}
          >
            {t(`tools.matrixOps.operacoes.${op}`)}
          </button>
        ))}
      </div>

      {/* Inputs de matriz */}
      <form onSubmit={handleCalcular} className="space-y-4">
        <div
          className={`grid gap-6 ${precisaDuasMatrizes ? "sm:grid-cols-2" : ""}`}
        >
          <MatrixInput
            label={
              precisaDuasMatrizes
                ? t("tools.matrixOps.matrizA")
                : t("tools.matrixOps.matriz")
            }
            matriz={matrizA}
            onChange={handleChangeA}
            tamanho={tamanho}
          />
          {precisaDuasMatrizes && (
            <MatrixInput
              label={t("tools.matrixOps.matrizB")}
              matriz={matrizB}
              onChange={handleChangeB}
              tamanho={tamanho}
            />
          )}
        </div>

        <Button type="submit">{t("tools.matrixOps.calcular")}</Button>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="mt-6">
          <p className="font-mono text-xs text-brand-500 uppercase tracking-wide mb-3">
            {t("tools.matrixOps.resultado")}
          </p>

          {resultado.tipo === "matriz" ? (
            <MatrixDisplay matriz={resultado.valor} destaque />
          ) : (
            <div className="rounded-lg bg-brand-50 dark:bg-brand-900/40 p-4 inline-block">
              <p className="font-mono text-xs text-brand-500 mb-1">
                {t("tools.matrixOps.operacoes.determinante")}
              </p>
              <p className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">
                {typeof resultado.valor === "number"
                  ? Number.isInteger(resultado.valor)
                    ? resultado.valor
                    : parseFloat(resultado.valor.toFixed(4))
                  : resultado.valor}
              </p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.matrixOps.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.matrixOps.ajuda.operacoes.titulo")}
          </p>
          <ul className="space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
            <li>{t("tools.matrixOps.ajuda.operacoes.somar")}</li>
            <li>{t("tools.matrixOps.ajuda.operacoes.subtrair")}</li>
            <li>{t("tools.matrixOps.ajuda.operacoes.multiplicar")}</li>
            <li>{t("tools.matrixOps.ajuda.operacoes.transposta")}</li>
            <li>{t("tools.matrixOps.ajuda.operacoes.determinante")}</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.matrixOps.ajuda.multiplicacao.titulo")}
          </p>
          <p>{t("tools.matrixOps.ajuda.multiplicacao.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.matrixOps.ajuda.determinante.titulo")}
          </p>
          <p>{t("tools.matrixOps.ajuda.determinante.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default MatrixOps;
