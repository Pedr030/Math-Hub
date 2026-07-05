import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CATEGORIAS,
  converter,
  converterParaTodas,
  fmtResultado,
} from "./unitConverter";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

const ICONES = {
  comprimento: "📏",
  massa: "⚖️",
  temperatura: "🌡️",
  volume: "🧴",
};

function UnitConverter() {
  const { t } = useTranslation();

  const categoriaIds = Object.keys(CATEGORIAS);
  const [categoriaId, setCategoriaId] = useState("comprimento");
  const [unidadeOrigem, setUnidadeOrigem] = useState("m");
  const [unidadeDestino, setUnidadeDestino] = useState("cm");
  const [valor, setValor] = useState("");
  const [expandido, setExpandido] = useState(false);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  const categoria = CATEGORIAS[categoriaId];
  const unidades = Object.keys(categoria.unidades);

  // Resultado da conversão principal (origem → destino)
  const resultadoPrincipal = (() => {
    const n = Number(valor);
    if (valor.trim() === "" || isNaN(n)) return null;
    try {
      return converter(n, categoriaId, unidadeOrigem, unidadeDestino);
    } catch {
      return null;
    }
  })();

  // Resultados de todas as unidades (para a seção expansível)
  const todosResultados = (() => {
    const n = Number(valor);
    if (!expandido || valor.trim() === "" || isNaN(n)) return null;
    try {
      return converterParaTodas(n, categoriaId, unidadeOrigem);
    } catch {
      return null;
    }
  })();

  function handleTrocarCategoria(novaCategoria) {
    setCategoriaId(novaCategoria);
    const base = CATEGORIAS[novaCategoria].base;
    const unidadesNova = Object.keys(CATEGORIAS[novaCategoria].unidades);
    setUnidadeOrigem(base);
    // Seleciona a segunda unidade como destino padrão
    setUnidadeDestino(unidadesNova[1] ?? base);
    setValor("");
    setExpandido(false);
  }

  function labelUnidade(codigo) {
    return t(`tools.unitConverter.unidades.${categoriaId}.${codigo}`, {
      defaultValue: codigo,
    });
  }

  const selectClasses = `rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm
    dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 focus:outline-none
    focus:ring-2 focus:ring-brand-400`;

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
      <div className="flex flex-wrap gap-2 mb-6">
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
            {ICONES[id]} {t(`tools.unitConverter.categorias.${id}`)}
          </button>
        ))}
      </div>

      {/* Conversão principal: origem → destino */}
      <div className="space-y-2">
        {/* Linha de origem */}
        <div className="flex gap-2">
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
          >
            {unidades.map((u) => (
              <option key={u} value={u}>
                {labelUnidade(u)}
              </option>
            ))}
          </select>
        </div>

        {/* Seta de conversão */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 border-t border-dashed border-brand-100 dark:border-brand-900" />
          <span className="font-mono text-xs text-brand-400 dark:text-brand-600">
            ↓
          </span>
          <div className="flex-1 border-t border-dashed border-brand-100 dark:border-brand-900" />
        </div>

        {/* Linha de destino */}
        <div className="flex gap-2">
          {/* Resultado */}
          <div
            className={`flex-1 rounded-lg border px-3 py-2 font-mono text-sm
            border-brand-100 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/40
            ${
              resultadoPrincipal !== null
                ? "text-brand-700 dark:text-brand-300 font-semibold text-base"
                : "text-slate-400"
            }`}
          >
            {resultadoPrincipal !== null
              ? fmtResultado(resultadoPrincipal)
              : "—"}
          </div>
          <select
            value={unidadeDestino}
            onChange={(e) => setUnidadeDestino(e.target.value)}
            className={selectClasses}
          >
            {unidades.map((u) => (
              <option key={u} value={u}>
                {labelUnidade(u)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Seção expansível: todas as unidades */}
      <div className="mt-5 border-t border-brand-100 pt-4 dark:border-brand-900">
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="font-mono text-xs text-brand-500 hover:underline"
        >
          {expandido
            ? t("tools.unitConverter.ocultarTodas")
            : t("tools.unitConverter.verTodas")}
        </button>

        {expandido && todosResultados && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {unidades.map((codigo) => {
              const ehOrigem = codigo === unidadeOrigem;
              return (
                <div
                  key={codigo}
                  className={`rounded-lg p-3 ${
                    ehOrigem
                      ? "ring-1 ring-brand-200 bg-brand-50 dark:bg-brand-900/40 dark:ring-brand-700"
                      : "bg-slate-50 dark:bg-brand-950/60"
                  }`}
                >
                  <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                    {labelUnidade(codigo)}
                    {ehOrigem && ` · ${t("tools.unitConverter.origem")}`}
                  </p>
                  <p
                    className={`font-mono font-semibold ${
                      ehOrigem
                        ? "text-brand-600 dark:text-brand-300"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {fmtResultado(todosResultados[codigo])}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
