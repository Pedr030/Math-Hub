import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { buscarTaxas, converter, MOEDAS } from "./currencyApi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

// Formata a data da última atualização de forma legível
function formatarDataAtualizacao(timestamp, locale) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function CurrencyConverter() {
  const { t, i18n } = useTranslation();

  const [valor, setValor] = useState("");
  const [moedaOrigem, setMoedaOrigem] = useState("BRL");
  const [moedaDestino, setMoedaDestino] = useState("USD");
  const [taxas, setTaxas] = useState(null); // { rates, atualizadoEm }
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  // Busca as taxas sempre que a moeda de origem mudar.
  // useCallback garante que a função não é recriada a cada render,
  // evitando loops infinitos no useEffect.
  const carregarTaxas = useCallback(async (moeda) => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await buscarTaxas(moeda);
      setTaxas(resultado);
    } catch (err) {
      setErro(err.message);
      setTaxas(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarTaxas(moedaOrigem);
  }, [moedaOrigem, carregarTaxas]);

  function trocarMoedas() {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
  }

  const resultado =
    taxas && valor && !isNaN(Number(valor)) && Number(valor) > 0
      ? converter(
          Number(valor),
          taxas.rates[moedaOrigem],
          taxas.rates[moedaDestino],
        )
      : null;

  // Como a moeda base das taxas é sempre moedaOrigem,
  // taxas.rates[moedaOrigem] === 1. Simplificando:
  const taxaDireta = taxas ? taxas.rates[moedaDestino] : null;

  const selectClasses = `rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm font-medium
    dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 focus:outline-none
    focus:ring-2 focus:ring-brand-400`;

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.currencyConverter.ajuda.titulo")}
          title={t("tools.currencyConverter.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {/* Valor + moeda origem */}
        <div className="flex gap-2">
          <Input
            type="number"
            step="any"
            min="0"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <select
            value={moedaOrigem}
            onChange={(e) => setMoedaOrigem(e.target.value)}
            className={selectClasses}
          >
            {MOEDAS.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.codigo}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de troca */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-brand-100 dark:border-brand-900" />
          <button
            type="button"
            onClick={trocarMoedas}
            title={t("tools.currencyConverter.trocar")}
            className="rounded-full p-2 border border-brand-200 text-brand-500
                       hover:bg-brand-50 transition-colors
                       dark:border-brand-700 dark:hover:bg-brand-900"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
            </svg>
          </button>
          <div className="flex-1 border-t border-brand-100 dark:border-brand-900" />
        </div>

        {/* Moeda destino */}
        <div className="flex gap-2">
          {/* Resultado ou placeholder */}
          <div
            className={`flex-1 rounded-lg border px-3 py-2 font-mono text-sm
            border-brand-100 bg-slate-50 dark:border-brand-800 dark:bg-brand-950/60
            ${resultado ? "text-brand-600 dark:text-brand-300 font-semibold" : "text-slate-400"}`}
          >
            {carregando
              ? t("tools.currencyConverter.carregando")
              : resultado !== null
                ? resultado.toLocaleString(i18n.language, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })
                : "—"}
          </div>
          <select
            value={moedaDestino}
            onChange={(e) => setMoedaDestino(e.target.value)}
            className={selectClasses}
          >
            {MOEDAS.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.codigo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Erro de rede/API */}
      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {/* Taxa de câmbio e última atualização */}
      {taxas && taxaDireta && !erro && (
        <div className="mt-4 space-y-1">
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
            1 {moedaOrigem} ={" "}
            {taxaDireta.toLocaleString(i18n.language, {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}{" "}
            {moedaDestino}
          </p>
          <p className="font-mono text-xs text-slate-300 dark:text-slate-600">
            {t("tools.currencyConverter.atualizadoEm")}{" "}
            {formatarDataAtualizacao(taxas.atualizadoEm, i18n.language)}
            {taxas.doCache && ` (${t("tools.currencyConverter.doCache")})`}
          </p>
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.currencyConverter.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.currencyConverter.ajuda.comoUsar.titulo")}
          </p>
          <p>{t("tools.currencyConverter.ajuda.comoUsar.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.currencyConverter.ajuda.cotacao.titulo")}
          </p>
          <p>{t("tools.currencyConverter.ajuda.cotacao.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.currencyConverter.ajuda.cache.titulo")}
          </p>
          <p>{t("tools.currencyConverter.ajuda.cache.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default CurrencyConverter;
