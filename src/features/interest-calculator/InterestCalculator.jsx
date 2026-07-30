import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calcularSimples, calcularComposto } from "./interest";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

// Catálogo de moedas disponíveis para o usuário escolher
const OPCOES_MOEDA = {
  BRL: { locale: "pt-BR", symbol: "R$" },
  USD: { locale: "en-US", symbol: "$" },
  EUR: { locale: "es-ES", symbol: "€" },
  GBP: { locale: "en-GB", symbol: "£" },
  JPY: { locale: "ja-JP", symbol: "¥" },
};

function InterestCalculator() {
  const { t } = useTranslation();

  const [capital, setCapital] = useState("");
  const [taxa, setTaxa] = useState("");
  const [periodos, setPeriodos] = useState("");
  const [unidade, setUnidade] = useState("mes");
  const [tipo, setTipo] = useState("composto");
  
  // Novo estado para controlar a moeda (padrão BRL)
  const [moeda, setMoeda] = useState("BRL");
  
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  // Extraímos os dados da moeda selecionada atualmente
  const { locale, symbol } = OPCOES_MOEDA[moeda];

  // Função dinâmica baseada na escolha do usuário
  function formatarMoeda(valor) {
    return valor.toLocaleString(locale, {
      style: "currency",
      currency: moeda,
      minimumFractionDigits: 2,
    });
  }

  function handleTrocarUnidade(novaUnidade) {
    if (periodos && !isNaN(Number(periodos))) {
      const p = Number(periodos);
      if (novaUnidade === "ano" && unidade === "mes") {
        setPeriodos(String(Math.max(1, Math.round(p / 12))));
      } else if (novaUnidade === "mes" && unidade === "ano") {
        setPeriodos(String(p * 12));
      }
    }
    setUnidade(novaUnidade);
    setResultado(null);
  }

  function taxaEquivalente(taxaPercent, tipo, unidadeAtual) {
    const i = taxaPercent / 100;
    if (unidadeAtual === "mes") {
      const anual =
        tipo === "composto" ? (Math.pow(1 + i, 12) - 1) * 100 : i * 12 * 100;
      return { valor: anual, unidade: "ano" };
    } else {
      const mensal =
        tipo === "composto"
          ? (Math.pow(1 + i, 1 / 12) - 1) * 100
          : (i / 12) * 100;
      return { valor: mensal, unidade: "mes" };
    }
  }

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    const C = Number(capital);
    const i = Number(taxa);
    const p = Number(periodos);

    if (!capital || !taxa || !periodos) {
      setErro(t("tools.interestCalculator.erros.camposVazios"));
      return;
    }
    if (isNaN(C) || isNaN(i) || isNaN(p)) {
      setErro(t("tools.interestCalculator.erros.numerosInvalidos"));
      return;
    }
    if (C <= 0 || i <= 0 || p <= 0) {
      setErro(t("tools.interestCalculator.erros.valoresPositivos"));
      return;
    }
    if (!Number.isInteger(p) || p > 600) {
      setErro(t("tools.interestCalculator.erros.periodosInvalidos"));
      return;
    }

    const calc = tipo === "simples" ? calcularSimples : calcularComposto;
    const equiv = taxaEquivalente(i, tipo, unidade);
    setResultado({ ...calc(C, i, p), taxaEquivalente: equiv });
  }

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.interestCalculator.ajuda.titulo")}
          title={t("tools.interestCalculator.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                   text-xs font-semibold text-brand-500 hover:bg-brand-50
                   dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {["simples", "composto"].map((opcao) => (
          <button
            key={opcao}
            type="button"
            onClick={() => {
              setTipo(opcao);
              setResultado(null);
            }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors
              ${
                tipo === opcao
                  ? "bg-brand-500 text-white"
                  : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
              }`}
          >
            {t(`tools.interestCalculator.tipo.${opcao}`)}
          </button>
        ))}
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* CAMPO CAPITAL COM SELETOR DE MOEDA */}
          <div>
            <label className="block font-mono text-xs text-brand-500 mb-1">
              {t("tools.interestCalculator.campos.capital")}
            </label>
            <div className="flex gap-2">
              <select
                value={moeda}
                onChange={(e) => {
                  setMoeda(e.target.value);
                  setResultado(null); // Limpa o resultado se trocar a moeda para evitar confusão
                }}
                className="rounded-lg border border-brand-100 bg-white px-2 py-2 text-sm font-medium
                           dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 cursor-pointer"
              >
                <option value="BRL">R$</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
                <option value="GBP">£</option>
                <option value="JPY">¥</option>
              </select>
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="Ex: 1000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-brand-500 mb-1">
              {t(
                `tools.interestCalculator.campos.taxa${unidade === "mes" ? "Mensal" : "Anual"}`,
              )}
            </label>
            <Input
              type="number"
              step="any"
              min="0"
              placeholder="Ex: 2"
              value={taxa}
              onChange={(e) => setTaxa(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-brand-500 mb-1">
              {t("tools.interestCalculator.campos.periodos")}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="1"
                min="1"
                max="600"
                placeholder="Ex: 12"
                value={periodos}
                onChange={(e) => setPeriodos(e.target.value)}
              />
              <select
                value={unidade}
                onChange={(e) => handleTrocarUnidade(e.target.value)}
                className="rounded-lg border border-brand-100 bg-white px-2 py-2 text-sm
                           dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 cursor-pointer"
              >
                <option value="mes">
                  {t("tools.interestCalculator.unidade.mes")}
                </option>
                <option value="ano">
                  {t("tools.interestCalculator.unidade.ano")}
                </option>
              </select>
            </div>
          </div>
        </div>

        <Button type="submit">{t("tools.interestCalculator.calcular")}</Button>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/40">
              <p className="font-mono text-xs text-brand-500 mb-1">
                {t("tools.interestCalculator.output.montante")}
              </p>
              <p className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">
                {formatarMoeda(resultado.montanteFinal)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-brand-950/60">
              <p className="font-mono text-xs text-slate-400 mb-1">
                {t("tools.interestCalculator.output.juros")}
              </p>
              <p className="font-display text-2xl font-semibold text-slate-700 dark:text-slate-300">
                {formatarMoeda(resultado.jurosTotais)}
              </p>
            </div>
          </div>

          <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
            {t(
              `tools.interestCalculator.output.taxaEquivalente.${resultado.taxaEquivalente.unidade}`,
              {
                valor: resultado.taxaEquivalente.valor.toFixed(4),
              },
            )}
          </p>

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 bg-white dark:bg-brand-950 p-4">
            <p className="font-mono text-xs text-brand-500 mb-3">
              {t("tools.interestCalculator.output.evolucao")} (Gráfico)
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resultado.tabela} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis 
                    dataKey="periodo" 
                    stroke="currentColor" 
                    className="text-xs text-slate-400 font-mono" 
                  />
                  <YAxis 
                    stroke="currentColor" 
                    className="text-xs text-slate-400 font-mono"
                    width={90}
                    tickFormatter={(valor) => {
                      // Usa o símbolo da moeda selecionada dinamicamente
                      if (valor >= 1000000) return `${symbol} ${(valor / 1000000).toFixed(1)}M`;
                      if (valor >= 1000) return `${symbol} ${(valor / 1000).toFixed(0)}k`;
                      return `${symbol} ${valor.toFixed(0)}`;
                    }}
                  />
                  <Tooltip 
                    formatter={(valor) => [formatarMoeda(valor), "Montante"]}
                    labelFormatter={(label) => `Período: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#090d16', 
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="montante" 
                    stroke="#0ea5e9" 
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">
                {t("tools.interestCalculator.output.evolucao")} (Tabela)
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-brand-950 border-b border-brand-100 dark:border-brand-900">
                  <tr>
                    <th className="font-mono text-xs text-slate-400 text-left px-4 py-2">
                      {t("tools.interestCalculator.output.periodo", {
                        unidade: t(
                          `tools.interestCalculator.unidade.${unidade}`,
                        ),
                      })}
                    </th>
                    <th className="font-mono text-xs text-slate-400 text-right px-4 py-2">
                      {t("tools.interestCalculator.output.jurosAcumulados")}
                    </th>
                    <th className="font-mono text-xs text-slate-400 text-right px-4 py-2">
                      {t("tools.interestCalculator.output.montanteTabela")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabela.map((linha, idx) => (
                    <tr
                      key={linha.periodo}
                      className={`border-b border-brand-50 dark:border-brand-900/50
                        ${idx % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-brand-950/30"}`}
                    >
                      <td className="font-mono text-xs px-4 py-2 text-slate-500">
                        {linha.periodo}
                      </td>
                      <td className="font-mono text-xs px-4 py-2 text-right text-slate-600 dark:text-slate-400">
                        {formatarMoeda(linha.juros)}
                      </td>
                      <td className="font-mono text-xs px-4 py-2 text-right font-medium text-brand-600 dark:text-brand-300">
                        {formatarMoeda(linha.montante)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.interestCalculator.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.interestCalculator.ajuda.tipos.titulo")}
          </p>
          <p>{t("tools.interestCalculator.ajuda.tipos.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.interestCalculator.ajuda.campos.titulo")}
          </p>
          <p>{t("tools.interestCalculator.ajuda.campos.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.interestCalculator.ajuda.taxa.titulo")}
          </p>
          <p>{t("tools.interestCalculator.ajuda.taxa.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.interestCalculator.ajuda.tabela.titulo")}
          </p>
          <p>{t("tools.interestCalculator.ajuda.tabela.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default InterestCalculator;