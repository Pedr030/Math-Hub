import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  LineChart, Line, 
  PieChart, Pie, Cell, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calcularSimples, calcularComposto } from "./interest";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

const OPCOES_MOEDA = {
  BRL: { locale: "pt-BR", symbol: "R$" },
  USD: { locale: "en-US", symbol: "$" },
  EUR: { locale: "es-ES", symbol: "€" },
  GBP: { locale: "en-GB", symbol: "£" },
  JPY: { locale: "ja-JP", symbol: "¥" },
};

const CORES_PIE = ['#0ea5e9', '#22c55e']; 

function InterestCalculator() {
  const { t } = useTranslation();

  const graficoRef = useRef(null);

  const [capital, setCapital] = useState("");
  const [taxa, setTaxa] = useState("");
  const [periodos, setPeriodos] = useState("");
  const [unidade, setUnidade] = useState("mes");
  const [tipo, setTipo] = useState("composto");
  
  const [moeda, setMoeda] = useState("BRL");
  
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  const [graficoAtivo, setGraficoAtivo] = useState("evolucao");
  
  const [isExporting, setIsExporting] = useState(false);

  const { locale, symbol } = OPCOES_MOEDA[moeda];

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
      const anual = tipo === "composto" ? (Math.pow(1 + i, 12) - 1) * 100 : i * 12 * 100;
      return { valor: anual, unidade: "ano" };
    } else {
      const mensal = tipo === "composto" ? (Math.pow(1 + i, 1 / 12) - 1) * 100 : (i / 12) * 100;
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
      setErro(t("tools.interestCalculator.erros.camposVazios")); return;
    }
    if (isNaN(C) || isNaN(i) || isNaN(p)) {
      setErro(t("tools.interestCalculator.erros.numerosInvalidos")); return;
    }
    if (C <= 0 || i <= 0 || p <= 0) {
      setErro(t("tools.interestCalculator.erros.valoresPositivos")); return;
    }
    if (!Number.isInteger(p) || p > 600) {
      setErro(t("tools.interestCalculator.erros.periodosInvalidos")); return;
    }

    const calc = tipo === "simples" ? calcularSimples : calcularComposto;
    const equiv = taxaEquivalente(i, tipo, unidade);
    setResultado({ ...calc(C, i, p), taxaEquivalente: equiv });
  }

  const getBackgroundColor = () => {
    return document.documentElement.classList.contains("dark") ? "#020617" : "#ffffff";
  };

  const exportarGrafico = async () => {
    if (!graficoRef.current) return;
    setIsExporting(true);

    setTimeout(async () => {
      try {
        const dataUrl = await toPng(graficoRef.current, { 
          backgroundColor: getBackgroundColor(), 
          pixelRatio: 2
        });
        const link = document.createElement("a");
        
        const baseName = t("tools.interestCalculator.output.nomeArquivoGrafico", "grafico_juros");
        link.download = `${baseName}_${tipo}.png`.replace(/\s+/g, '_').toLowerCase();
        
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Erro ao exportar gráfico", err);
      } finally {
        setIsExporting(false);
      }
    }, 250);
  };

  const exportarRelatorioPDF = async () => {
    setIsExporting(true);

    setTimeout(async () => {
      try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let currentY = 20;

        pdf.setFontSize(18);
        pdf.setTextColor(15, 23, 42); 
        const titulo = t(`tools.interestCalculator.tipo.${tipo}`).toUpperCase();
        pdf.text(titulo, margin, currentY);
        currentY += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139); 
        const resumoInputs = t("tools.interestCalculator.output.resumoPdf", {
          capital: formatarMoeda(Number(capital)),
          taxa: taxa,
          unidadeTaxa: t(`tools.interestCalculator.unidade.${unidade}_singular`),
          periodos: periodos,
          unidadePeriodos: Number(periodos) === 1 
            ? t(`tools.interestCalculator.unidade.${unidade}_singular`) 
            : t(`tools.interestCalculator.unidade.${unidade}_plural`)
        });
        pdf.text(resumoInputs, margin, currentY);
        currentY += 12;

        pdf.setFontSize(12);
        pdf.setTextColor(14, 165, 233); 
        pdf.setFont(undefined, 'bold');
        pdf.text(`${t("tools.interestCalculator.output.montante")}: ${formatarMoeda(resultado.montanteFinal)}`, margin, currentY);
        pdf.text(`${t("tools.interestCalculator.output.juros")}: ${formatarMoeda(resultado.jurosTotais)}`, pageWidth / 2, currentY);
        currentY += 15;

        pdf.setFont(undefined, 'normal');

        if (graficoRef.current) {
          const dataUrl = await toJpeg(graficoRef.current, { 
            backgroundColor: '#ffffff', 
            quality: 0.95,              
            pixelRatio: 1.5
          });
          
          const imgProps = pdf.getImageProperties(dataUrl);
          const printWidth = pageWidth - (margin * 2);
          const printHeight = (imgProps.height * printWidth) / imgProps.width;
          
          pdf.addImage(dataUrl, "JPEG", margin, currentY, printWidth, printHeight);
          currentY += printHeight + 15;
        }

        const tableBody = resultado.tabela.map(linha => [
          linha.periodo,
          formatarMoeda(linha.juros),
          formatarMoeda(linha.montante)
        ]);

        autoTable(pdf, {
          startY: currentY,
          head: [[
            t("tools.interestCalculator.output.periodo", { unidade: t(`tools.interestCalculator.unidade.${unidade}`) }),
            t("tools.interestCalculator.output.jurosAcumulados"),
            t("tools.interestCalculator.output.montanteTabela")
          ]],
          body: tableBody,
          theme: 'striped',
          headStyles: { fillColor: [14, 165, 233], textColor: 255 },
          styles: { fontSize: 9, halign: 'right', cellPadding: 3 },
          columnStyles: { 0: { halign: 'center' } }, 
          alternateRowStyles: { fillColor: [248, 250, 252] }, 
          margin: { left: margin, right: margin, bottom: 20 }
        });

        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(148, 163, 184);
          
          const footerStr = `${t("tools.interestCalculator.output.marcaDagua", "Gerado por Math Hub")} - mathhub.app`;
          pdf.text(footerStr, margin, pageHeight - 10);
          pdf.text(`${i} / ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        const baseName = t("tools.interestCalculator.output.nomeArquivoPdf", "relatorio_juros");
        pdf.save(`${baseName}_${tipo}.pdf`.replace(/\s+/g, '_').toLowerCase());
      } catch (err) {
        console.error("Erro ao exportar PDF", err);
      } finally {
        setIsExporting(false);
      }
    }, 250);
  };

  const dadosComposicao = resultado ? [
    { nome: t("tools.interestCalculator.output.capitalLabel", "Capital Inicial"), valor: Number(capital) },
    { nome: t("tools.interestCalculator.output.jurosLabel", "Juros Totais"), valor: resultado.jurosTotais }
  ] : [];

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button type="button" onClick={() => setMostrarAjuda(true)} className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-xs font-semibold text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900">?</button>
      </div>

      <div className="flex gap-2 mb-5">
        {["simples", "composto"].map((opcao) => (
          <button
            key={opcao}
            type="button"
            onClick={() => { setTipo(opcao); setResultado(null); }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${tipo === opcao ? "bg-brand-500 text-white" : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"}`}
          >
            {t(`tools.interestCalculator.tipo.${opcao}`)}
          </button>
        ))}
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-mono text-xs text-brand-500 mb-1">{t("tools.interestCalculator.campos.capital")}</label>
            <div className="flex gap-2">
              <select value={moeda} onChange={(e) => { setMoeda(e.target.value); setResultado(null); }} className="rounded-lg border border-brand-100 bg-white px-2 py-2 text-sm font-medium dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 cursor-pointer">
                <option value="BRL">R$</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
                <option value="GBP">£</option>
                <option value="JPY">¥</option>
              </select>
              <Input type="number" step="any" min="0" value={capital} onChange={(e) => setCapital(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs text-brand-500 mb-1">{t(`tools.interestCalculator.campos.taxa${unidade === "mes" ? "Mensal" : "Anual"}`)}</label>
            <Input type="number" step="any" min="0" value={taxa} onChange={(e) => setTaxa(e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-xs text-brand-500 mb-1">{t("tools.interestCalculator.campos.periodos")}</label>
            <div className="flex gap-2">
              <Input type="number" step="1" min="1" max="600" value={periodos} onChange={(e) => setPeriodos(e.target.value)} />
              <select value={unidade} onChange={(e) => handleTrocarUnidade(e.target.value)} className="rounded-lg border border-brand-100 bg-white px-2 py-2 text-sm dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100 cursor-pointer">
                <option value="mes">{t("tools.interestCalculator.unidade.mes")}</option>
                <option value="ano">{t("tools.interestCalculator.unidade.ano")}</option>
              </select>
            </div>
          </div>
        </div>
        <Button type="submit">{t("tools.interestCalculator.calcular")}</Button>
      </form>

      {erro && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{t("common.erroPre")} {erro}</p>}

      {resultado && (
        <div className="mt-6 space-y-4">
          
          <div className="flex flex-wrap gap-3 justify-end border-b border-brand-100 dark:border-brand-900 pb-4">
            <button 
              onClick={exportarGrafico}
              disabled={isExporting}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/50 transition-colors disabled:opacity-50"
            >
              {isExporting ? t("common.exportar.exportando", "Exportando...") : t("common.exportar.grafico", "Baixar Gráfico (PNG)")}
            </button>
            <button 
              onClick={exportarRelatorioPDF}
              disabled={isExporting}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              {isExporting ? t("common.exportar.exportando", "Exportando...") : t("common.exportar.relatorio", "Baixar Relatório (PDF)")}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/40">
              <p className="font-mono text-xs text-brand-500 mb-1">{t("tools.interestCalculator.output.montante")}</p>
              <p className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">{formatarMoeda(resultado.montanteFinal)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-brand-950/60">
              <p className="font-mono text-xs text-slate-400 mb-1">{t("tools.interestCalculator.output.juros")}</p>
              <p className="font-display text-2xl font-semibold text-slate-700 dark:text-slate-300">{formatarMoeda(resultado.jurosTotais)}</p>
            </div>
          </div>

          <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
            {t(`tools.interestCalculator.output.taxaEquivalente.${resultado.taxaEquivalente.unidade}`, { valor: resultado.taxaEquivalente.valor.toFixed(4) })}
          </p>

          <div 
            ref={graficoRef} 
            className={`w-full rounded-lg ${isExporting ? "bg-white text-slate-800 p-8" : "border border-brand-100 dark:border-brand-900 bg-white dark:bg-brand-950 p-4"}`}
          >
            {!isExporting && (
              <div className="flex gap-2 mb-6 border-b border-slate-100 dark:border-brand-900 pb-2">
                {[
                  { id: "evolucao", label: t("tools.interestCalculator.graficos.evolucao", "Evolução (Linha)") },
                  { id: "proporcao", label: t("tools.interestCalculator.graficos.proporcao", "Proporção (Pizza)") }
                ].map((aba) => (
                  <button
                    key={aba.id}
                    type="button"
                    onClick={() => setGraficoAtivo(aba.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${graficoAtivo === aba.id ? "bg-brand-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-brand-900"}`}
                  >
                    {aba.label}
                  </button>
                ))}
              </div>
            )}

            {isExporting && (
              <p className="font-mono text-xs text-brand-500 mb-6 text-center uppercase tracking-wider">
                {graficoAtivo === "evolucao" ? t("tools.interestCalculator.graficos.evolucao", "Evolução (Linha)") : t("tools.interestCalculator.graficos.proporcao", "Proporção (Pizza)")}
              </p>
            )}

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {graficoAtivo === "evolucao" ? (
                  <LineChart data={resultado.tabela} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className={isExporting ? "stroke-slate-200" : "stroke-slate-200 dark:stroke-slate-800"} />
                    <XAxis dataKey="periodo" stroke="currentColor" className="text-xs font-mono" />
                    <YAxis stroke="currentColor" className="text-xs font-mono" width={90} tickFormatter={(valor) => { if (valor >= 1000000) return `${symbol} ${(valor / 1000000).toFixed(1)}M`; if (valor >= 1000) return `${symbol} ${(valor / 1000).toFixed(0)}k`; return `${symbol} ${valor.toFixed(0)}`; }} />
                    <Tooltip formatter={(valor) => [formatarMoeda(valor), t("tools.interestCalculator.output.montanteTabela", "Montante")]} labelFormatter={(label) => `${t("tools.interestCalculator.output.periodo", "Período")}: ${label}`} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Line isAnimationActive={!isExporting} type="monotone" dataKey="montante" stroke="#0ea5e9" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Tooltip formatter={(valor, name) => { const porcentagem = ((valor / resultado.montanteFinal) * 100).toFixed(1); return [`${formatarMoeda(valor)} (${porcentagem}%)`, name]; }} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: isExporting ? '#475569' : 'var(--text-slate-400, #94a3b8)' }} />
                    <Pie
                      isAnimationActive={!isExporting} 
                      data={dadosComposicao}
                      dataKey="valor"
                      nameKey="nome"
                      cx="50%" cy="45%" outerRadius={75} innerRadius={40} paddingAngle={2}
                      label={isExporting ? ({ percent }) => `${(percent * 100).toFixed(1)}%` : false}
                    >
                      {dadosComposicao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* MARCA D'ÁGUA COM A LOGO COM CAMINHO CORRIGIDO */}
            {isExporting && (
              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="/favicon/web-app-manifest-192x192.png" alt="Logo" className="h-6 w-6 rounded-md" />
                  <span className="font-display font-bold text-slate-800 text-sm tracking-wide">Math Hub</span>
                </div>
                <p className="text-slate-400 font-mono text-[10px]">mathhub.app</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">{t("tools.interestCalculator.output.evolucao")} (Tabela)</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-brand-950 border-b border-brand-100 dark:border-brand-900">
                  <tr>
                    <th className="font-mono text-xs text-slate-400 text-left px-4 py-2">{t("tools.interestCalculator.output.periodo", { unidade: t(`tools.interestCalculator.unidade.${unidade}`) })}</th>
                    <th className="font-mono text-xs text-slate-400 text-right px-4 py-2">{t("tools.interestCalculator.output.jurosAcumulados")}</th>
                    <th className="font-mono text-xs text-slate-400 text-right px-4 py-2">{t("tools.interestCalculator.output.montanteTabela")}</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabela.map((linha, idx) => (
                    <tr key={linha.periodo} className={`border-b border-brand-50 dark:border-brand-900/50 ${idx % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-brand-950/30"}`}>
                      <td className="font-mono text-xs px-4 py-2 text-slate-500">{linha.periodo}</td>
                      <td className="font-mono text-xs px-4 py-2 text-right text-slate-600 dark:text-slate-400">{formatarMoeda(linha.juros)}</td>
                      <td className="font-mono text-xs px-4 py-2 text-right font-medium text-brand-600 dark:text-brand-300">{formatarMoeda(linha.montante)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={mostrarAjuda} onClose={() => setMostrarAjuda(false)} title={t("tools.interestCalculator.ajuda.titulo")} />
    </ToolCard>
  );
}

export default InterestCalculator;