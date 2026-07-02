import { useState } from "react";
import { useTranslation } from "react-i18next";
import { calcularEstatisticas } from "./statistics";
import Button from "../../components/ui/Button";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

// Formata números evitando casas decimais desnecessárias
function fmt(n, casas = 4) {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(casas)).toString();
}

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

function DescriptiveStats() {
  const { t } = useTranslation();
  const [entrada, setEntrada] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    if (!entrada.trim()) {
      setErro(t("tools.descriptiveStats.erros.vazio"));
      return;
    }

    try {
      setResultado(calcularEstatisticas(entrada));
    } catch (err) {
      setErro(err.message);
    }
  }

  function formatarModa(moda) {
    if (!moda) return t("tools.descriptiveStats.semModa");
    return moda.map(fmt).join(", ");
  }

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.descriptiveStats.ajuda.titulo")}
          title={t("tools.descriptiveStats.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        <textarea
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={t("tools.descriptiveStats.placeholder")}
          rows={3}
          className="w-full rounded-lg border border-brand-100 bg-white px-3 py-2
                     font-mono text-sm resize-none focus:outline-none focus:ring-2
                     focus:ring-brand-400 dark:border-brand-800 dark:bg-brand-950
                     dark:text-slate-100"
        />
        <Button type="submit">{t("tools.descriptiveStats.calcular")}</Button>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {resultado && (
        <div className="mt-6 space-y-4">
          {/* Métricas principais em destaque */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard
              destaque
              label={t("tools.descriptiveStats.output.media")}
              value={fmt(resultado.media)}
            />
            <ResultCard
              destaque
              label={t("tools.descriptiveStats.output.mediana")}
              value={fmt(resultado.mediana)}
            />
            <ResultCard
              destaque
              label={t("tools.descriptiveStats.output.desvioPadrao")}
              value={fmt(resultado.desvioPadrao)}
            />
          </div>

          {/* Métricas secundárias */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard
              label={t("tools.descriptiveStats.output.minimo")}
              value={fmt(resultado.minimo)}
            />
            <ResultCard
              label={t("tools.descriptiveStats.output.maximo")}
              value={fmt(resultado.maximo)}
            />
            <ResultCard
              label={t("tools.descriptiveStats.output.amplitude")}
              value={fmt(resultado.amplitude)}
            />
            <ResultCard
              label={t("tools.descriptiveStats.output.contagem")}
              value={resultado.contagem}
            />
          </div>

          {/* Moda e variância */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultCard
              label={t("tools.descriptiveStats.output.moda")}
              value={formatarModa(resultado.moda)}
            />
            <ResultCard
              label={t("tools.descriptiveStats.output.variancia")}
              value={fmt(resultado.variancia)}
            />
          </div>

          {/* Valores ordenados */}
          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">
                {t("tools.descriptiveStats.output.ordenados")} (
                {resultado.contagem})
              </p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {resultado.numeros.map(fmt).join("  ·  ")}
            </p>
          </div>
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.descriptiveStats.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.descriptiveStats.ajuda.entrada.titulo")}
          </p>
          <p>{t("tools.descriptiveStats.ajuda.entrada.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.descriptiveStats.ajuda.metricas.titulo")}
          </p>
          <ul className="space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
            <li>{t("tools.descriptiveStats.ajuda.metricas.media")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.mediana")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.moda")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.desvioPadrao")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.variancia")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.amplitude")}</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.descriptiveStats.ajuda.moda.titulo")}
          </p>
          <p>{t("tools.descriptiveStats.ajuda.moda.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default DescriptiveStats;
