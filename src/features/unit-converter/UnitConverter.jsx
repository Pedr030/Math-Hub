import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CATEGORIAS, converterParaTodas, fmtResultado } from "./unitConverter";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

function UnitConverter() {
  const { t } = useTranslation();

  const categoriaIds = Object.keys(CATEGORIAS);
  const [categoriaId, setCategoriaId] = useState("comprimento");
  const [unidadeOrigem, setUnidadeOrigem] = useState("m");
  const [valor, setValor] = useState("");
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  const categoria = CATEGORIAS[categoriaId];
  const unidades = Object.entries(categoria.unidades);

  // Calcula resultados em tempo real (sem botão de submit)
  const resultados = (() => {
    const n = Number(valor);
    if (valor.trim() === "" || isNaN(n)) return null;
    try {
      return converterParaTodas(n, categoriaId, unidadeOrigem);
    } catch {
      return null;
    }
  })();

  function handleTrocarCategoria(novaCategoria) {
    setCategoriaId(novaCategoria);
    // Seleciona a unidade base da nova categoria como padrão
    setUnidadeOrigem(CATEGORIAS[novaCategoria].base);
    setValor("");
  }

  const icones = {
    comprimento: "📏",
    massa: "⚖️",
    temperatura: "🌡️",
    volume: "🧴",
  };

  const selectClasses = `rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm
    dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 focus:outline-none
    focus:ring-2 focus:ring-brand-400 w-full`;

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.unitConverter.ajuda.titulo")}
          title={t("tools.unitConverter.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      {/* Seletor de categoria */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categoriaIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTrocarCategoria(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
              ${
                categoriaId === id
                  ? "bg-brand-500 text-white"
                  : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
              }`}
          >
            {icones[id]} {t(`tools.unitConverter.categorias.${id}`)}
          </button>
        ))}
      </div>

      {/* Input + seletor de unidade de origem */}
      <div className="flex gap-2 mb-6">
        <Input
          type="number"
          step="any"
          placeholder="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <select
          value={unidadeOrigem}
          onChange={(e) => setUnidadeOrigem(e.target.value)}
          className={selectClasses}
          style={{ width: "auto", flexShrink: 0 }}
        >
          {unidades.map(([codigo, { label }]) => (
            <option key={codigo} value={codigo}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados em todas as unidades */}
      {resultados && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {unidades.map(([codigo, { label }]) => {
            const ehOrigem = codigo === unidadeOrigem;
            return (
              <div
                key={codigo}
                className={`rounded-lg p-3 ${
                  ehOrigem
                    ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/40 dark:ring-brand-700"
                    : "bg-slate-50 dark:bg-brand-950/60"
                }`}
              >
                <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                  {label}
                  {ehOrigem && ` · ${t("tools.unitConverter.origem")}`}
                </p>
                <p
                  className={`font-mono font-semibold ${
                    ehOrigem
                      ? "text-brand-600 dark:text-brand-300"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {fmtResultado(resultados[codigo])}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.unitConverter.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.unitConverter.ajuda.comoUsar.titulo")}
          </p>
          <p>{t("tools.unitConverter.ajuda.comoUsar.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.unitConverter.ajuda.temperatura.titulo")}
          </p>
          <p>{t("tools.unitConverter.ajuda.temperatura.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.unitConverter.ajuda.precisao.titulo")}
          </p>
          <p>{t("tools.unitConverter.ajuda.precisao.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default UnitConverter;
