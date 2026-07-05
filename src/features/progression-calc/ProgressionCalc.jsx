import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  calcularPA,
  calcularPG,
  identificarProgressao,
  parsearSequencia,
  fmt,
} from "./progressionCalc";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

function ResultCard({ label, value, destaque = false }) {
  return (
    <div
      className={`rounded-lg p-3 ${
        destaque
          ? "bg-brand-50 dark:bg-brand-900/40"
          : "bg-slate-50 dark:bg-brand-950/60"
      }`}
    >
      <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-0.5">
        {label}
      </p>
      <p
        className={`font-display font-semibold ${
          destaque
            ? "text-xl text-brand-700 dark:text-brand-300"
            : "text-lg text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProgressionCalc() {
  const { t } = useTranslation();

  const [modo, setModo] = useState("pa"); // 'pa' | 'pg' | 'identificar'
  const [a1, setA1] = useState("");
  const [razao, setRazao] = useState("");
  const [n, setN] = useState("");
  const [sequencia, setSequencia] = useState("");
  const [resultado, setResultado] = useState(null);
  const [identificacao, setIdentificacao] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);
    setIdentificacao(null);

    if (modo === "identificar") {
      if (!sequencia.trim()) {
        setErro(t("tools.progressionCalc.erros.vazioSeq"));
        return;
      }
      try {
        const nums = parsearSequencia(sequencia);
        if (nums.length < 2) {
          setErro(t("tools.progressionCalc.erros.minimoTermos"));
          return;
        }
        setIdentificacao({ nums, ...identificarProgressao(nums) });
      } catch (err) {
        setErro(err.message);
      }
      return;
    }

    const vA1 = Number(a1);
    const vRazao = Number(razao);
    const vN = Number(n);

    if (!a1 || !razao || !n) {
      setErro(t("tools.progressionCalc.erros.camposVazios"));
      return;
    }
    if (isNaN(vA1) || isNaN(vRazao) || isNaN(vN)) {
      setErro(t("tools.progressionCalc.erros.numerosInvalidos"));
      return;
    }
    if (!Number.isInteger(vN) || vN < 1 || vN > 100) {
      setErro(t("tools.progressionCalc.erros.nInvalido"));
      return;
    }

    try {
      const res =
        modo === "pa"
          ? calcularPA(vA1, vRazao, vN)
          : calcularPG(vA1, vRazao, vN);
      setResultado(res);
    } catch (err) {
      setErro(err.message);
    }
  }

  const modos = ["pa", "pg", "identificar"];

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.progressionCalc.ajuda.titulo")}
          title={t("tools.progressionCalc.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      {/* Toggle de modo */}
      <div className="flex flex-wrap gap-2 mb-5">
        {modos.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setModo(m);
              setResultado(null);
              setIdentificacao(null);
              setErro(null);
            }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors
              ${
                modo === m
                  ? "bg-brand-500 text-white"
                  : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
              }`}
          >
            {t(`tools.progressionCalc.modos.${m}`)}
          </button>
        ))}
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        {modo === "identificar" ? (
          <Input
            value={sequencia}
            onChange={(e) => setSequencia(e.target.value)}
            placeholder={t("tools.progressionCalc.placeholderSeq")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-xs text-brand-500 mb-1">
                {t("tools.progressionCalc.campos.a1")}
              </label>
              <Input
                type="number"
                step="any"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-brand-500 mb-1">
                {t(
                  `tools.progressionCalc.campos.razao${modo === "pa" ? "PA" : "PG"}`,
                )}
              </label>
              <Input
                type="number"
                step="any"
                value={razao}
                onChange={(e) => setRazao(e.target.value)}
                placeholder={modo === "pa" ? "Ex: 3" : "Ex: 2"}
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-brand-500 mb-1">
                {t("tools.progressionCalc.campos.n")}
              </label>
              <Input
                type="number"
                step="1"
                min="1"
                max="100"
                value={n}
                onChange={(e) => setN(e.target.value)}
                placeholder="Ex: 6"
              />
            </div>
          </div>
        )}

        <Button type="submit">
          {modo === "identificar"
            ? t("tools.progressionCalc.identificar")
            : t("tools.progressionCalc.calcular")}
        </Button>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {/* Resultado de PA ou PG */}
      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard
              destaque
              label={t("tools.progressionCalc.output.an")}
              value={fmt(resultado.an)}
            />
            <ResultCard
              destaque
              label={t("tools.progressionCalc.output.soma")}
              value={fmt(resultado.soma)}
            />
            <ResultCard
              label={t("tools.progressionCalc.output.a1")}
              value={fmt(resultado.a1)}
            />
            <ResultCard
              label={t("tools.progressionCalc.output.razao")}
              value={fmt(resultado.razao)}
            />
          </div>

          {/* Sequência de termos */}
          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">
                {t("tools.progressionCalc.output.termos", { n: resultado.n })}
              </p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {resultado.termos.map(fmt).join("  ·  ")}
            </p>
          </div>
        </div>
      )}

      {/* Resultado da identificação */}
      {identificacao && (
        <div className="mt-6 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <div
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                identificacao.tipoPA
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-slate-50 text-slate-400 dark:bg-brand-950/60 dark:text-slate-500"
              }`}
            >
              PA{" "}
              {identificacao.tipoPA
                ? `✓ (r = ${fmt(identificacao.razaoPA)})`
                : "✗"}
            </div>
            <div
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                identificacao.tipoPG
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-slate-50 text-slate-400 dark:bg-brand-950/60 dark:text-slate-500"
              }`}
            >
              PG{" "}
              {identificacao.tipoPG
                ? `✓ (q = ${fmt(identificacao.razaoPG)})`
                : "✗"}
            </div>
          </div>

          {!identificacao.tipoPA && !identificacao.tipoPG && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("tools.progressionCalc.output.nenhuma")}
            </p>
          )}

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">
                {t("tools.progressionCalc.output.sequencia")}
              </p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
              {identificacao.nums.map(fmt).join("  ·  ")}
            </p>
          </div>
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.progressionCalc.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.progressionCalc.ajuda.pa.titulo")}
          </p>
          <p>{t("tools.progressionCalc.ajuda.pa.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.progressionCalc.ajuda.pg.titulo")}
          </p>
          <p>{t("tools.progressionCalc.ajuda.pg.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.progressionCalc.ajuda.identificar.titulo")}
          </p>
          <p>{t("tools.progressionCalc.ajuda.identificar.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default ProgressionCalc;
