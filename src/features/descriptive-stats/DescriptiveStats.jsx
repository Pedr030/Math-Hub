import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart, Bar,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import autoTable from "jspdf-autotable";
import { calcularEstatisticas } from "./statistics";
import Button from "../../components/ui/Button";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";
import ExportPanel from "../../components/ui/ExportPanel";
import { PDF_CORES } from "../../utils/pdfColors";
import { useChartExport } from "../../hooks/useChartExport";
import { criarPDF, desenharGraficoComCard, adicionarRodapeEBaixar } from "../../utils/pdfExport";

function fmt(n, casas = 4) {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(casas)).toString();
}

function ResultCard({ label, value, destaque = false }) {
  return (
    <div className={`rounded-lg p-3 ${destaque ? "bg-brand-50 dark:bg-brand-900/40" : "bg-slate-50 dark:bg-brand-950/60"}`}>
      <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
      <p className={`font-display font-semibold ${destaque ? "text-xl text-brand-700 dark:text-brand-300" : "text-lg text-slate-700 dark:text-slate-200"}`}>{value}</p>
    </div>
  );
}

const CORES_PIE = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#f97316', '#22c55e', '#eab308', '#6366f1', '#d946ef', '#14b8a6', '#3b82f6'];

function DescriptiveStats() {
  const { t } = useTranslation();

  const { exportMode, graficoRef, isDark, axisColor, exportarGrafico, exportarPDF } = useChartExport();

  const [entrada, setEntrada] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  const [graficoAtivo, setGraficoAtivo] = useState("barras");

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    if (!entrada.trim()) {
      setErro(t("tools.descriptiveStats.erros.vazio", "Insira alguns números."));
      return;
    }

    try {
      setResultado(calcularEstatisticas(entrada));
    } catch (err) {
      const chaves = {
        VALOR_INVALIDO: () => t("tools.descriptiveStats.erros.valorInvalido", { valor: err.valor }),
        NENHUM_NUMERO: () => t("tools.descriptiveStats.erros.nenhumNumero"),
        MAX_EXCEDIDO: () => t("tools.descriptiveStats.erros.maxExcedido"),
      };
      setErro(chaves[err.codigo] ? chaves[err.codigo]() : err.message);
    }
  }

  function formatarModa(moda) {
    if (!moda) return t("tools.descriptiveStats.semModa", "Amodal");
    return moda.map(fmt).join(", ");
  }

  let dadosAgrupados = [];
  let dadosDispersao = [];
  
  if (resultado) {
    const mapFreq = new Map();
    resultado.numeros.forEach((n, index) => {
      mapFreq.set(n, (mapFreq.get(n) || 0) + 1);
      dadosDispersao.push({ indice: index + 1, valor: n });
    });
    
    let frequenciaAcumulada = 0;
    dadosAgrupados = Array.from(mapFreq.entries())
      .sort(([valorA], [valorB]) => valorA - valorB)
      .map(([valor, frequencia]) => {
        frequenciaAcumulada += frequencia;
        return {
          valorFormatado: fmt(valor),
          valorBruto: valor,
          frequencia: frequencia,
          acumulada: frequenciaAcumulada,
        };
      });
  }

  function handleExportarGrafico() {
    const baseName = t("tools.descriptiveStats.output.nomeArquivoGrafico", "grafico_estatistica");
    exportarGrafico(`${baseName}.png`.replace(/\s+/g, '_').toLowerCase());
  }

  function handleExportarPDF() {
    exportarPDF(async () => {
      const { pdf, pageWidth, pageHeight, margin } = criarPDF();
      let currentY = 20;

      pdf.setFontSize(18);
      pdf.setTextColor(...PDF_CORES.slate900);
      pdf.text(t("ferramentas.estatistica-descritiva.nome").toUpperCase(), margin, currentY);
      currentY += 12;

      pdf.setFontSize(10);
      pdf.setTextColor(...PDF_CORES.brand400);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${t("tools.descriptiveStats.output.media", "Média")}: ${fmt(resultado.media)}`, margin, currentY);
      pdf.text(`${t("tools.descriptiveStats.output.mediana", "Mediana")}: ${fmt(resultado.mediana)}`, margin + 60, currentY);
      pdf.text(`${t("tools.descriptiveStats.output.moda", "Moda")}: ${formatarModa(resultado.moda)}`, margin + 120, currentY);
      currentY += 8;

      pdf.setTextColor(...PDF_CORES.slate500);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${t("tools.descriptiveStats.output.desvioPadrao", "Desvio Padrão")}: ${fmt(resultado.desvioPadrao)}`, margin, currentY);
      pdf.text(`${t("tools.descriptiveStats.output.variancia", "Variância")}: ${fmt(resultado.variancia)}`, margin + 60, currentY);
      pdf.text(`${t("tools.descriptiveStats.output.amplitude", "Amplitude")}: ${fmt(resultado.amplitude)}`, margin + 120, currentY);
      currentY += 8;

      pdf.text(`${t("tools.descriptiveStats.output.minimo", "Mínimo")}: ${fmt(resultado.minimo)}`, margin, currentY);
      pdf.text(`${t("tools.descriptiveStats.output.maximo", "Máximo")}: ${fmt(resultado.maximo)}`, margin + 60, currentY);
      pdf.text(`${t("tools.descriptiveStats.output.contagem", "Contagem")}: ${resultado.contagem}`, margin + 120, currentY);
      currentY += 15;

      currentY = await desenharGraficoComCard(pdf, { graficoRef, currentY, margin, pageWidth });

      const tableBody = dadosAgrupados.map(d => [
        d.valorFormatado,
        d.frequencia,
        d.acumulada
      ]);

      autoTable(pdf, {
        startY: currentY,
        head: [[
          t("tools.descriptiveStats.output.valor", "Valor"),
          t("tools.descriptiveStats.output.contagem", "Frequência"),
          t("tools.descriptiveStats.graficos.area", "Frequência Acumulada")
        ]],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233], textColor: 255 },
        styles: { fontSize: 9, halign: 'center', cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: margin, right: margin, bottom: 20 }
      });

      const baseName = t("tools.descriptiveStats.output.nomeArquivoPdf", "relatorio_estatistica");
      adicionarRodapeEBaixar(pdf, {
        margin, pageWidth, pageHeight,
        nomeArquivo: `${baseName}.pdf`.replace(/\s+/g, '_').toLowerCase(),
        marcaDagua: t("common.exportar.marcaDagua", "Gerado por Math Hub"),
      });
    });
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.001) return null;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textColor = exportMode === 'pdf' ? '#475569' : (isDark ? '#cbd5e1' : '#475569');

    return (
      <text x={x} y={y} fill={textColor} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="11px" fontWeight="600" className="font-mono">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const chartBarras = (
    <BarChart data={dadosAgrupados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} className={exportMode === 'pdf' ? "stroke-slate-200" : "stroke-slate-200 dark:stroke-slate-800"} />
      <XAxis dataKey="valorFormatado" stroke={axisColor} className="text-xs font-mono" />
      <YAxis allowDecimals={false} stroke={axisColor} className="text-xs font-mono" width={40} />
      <Tooltip formatter={(valor) => [valor, t("tools.descriptiveStats.output.frequenciaTooltip", "Frequência")]} labelFormatter={(label) => `${t("tools.descriptiveStats.output.valor", "Valor")}: ${label}`} cursor={{ fill: 'var(--tooltip-cursor, #334155)', opacity: 0.15 }} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
      <Bar isAnimationActive={!exportMode} dataKey="frequencia" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={60} />
    </BarChart>
  );

  const chartPizza = (
    // AQUI: Aumentamos a margem inferior para dar mais espaço para a legenda e evitamos cortes nas laterais
    <PieChart margin={{ top: 15, right: 35, left: 35, bottom: 25 }}>
      <Tooltip formatter={(valor, name, props) => { const porcentagem = ((valor / resultado?.contagem) * 100).toFixed(1); return [`${valor} (${porcentagem}%)`, `${t("tools.descriptiveStats.output.valor", "Valor")}: ${props.payload.valorFormatado}`]; }} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
      <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: '12px' }} formatter={(value) => <span style={{ color: axisColor }}>{value}</span>} />
      <Pie
        isAnimationActive={!exportMode}
        data={dadosAgrupados}
        dataKey="frequencia"
        nameKey="valorFormatado"
        cx="50%" cy="45%" // Empurramos a pizza um pouquinho para cima (45% ao invés de 50%)
        outerRadius={exportMode === 'pdf' ? 45 : 70} 
        innerRadius={exportMode === 'pdf' ? 25 : 35} 
        paddingAngle={2}
        labelLine={false}
        label={renderCustomLabel}
      >
        {dadosAgrupados.map((entry, index) => {
          const hue = (index * (360 / Math.max(dadosAgrupados.length, 1))) % 360;
          const corDinamica = `hsl(${hue}, 75%, 55%)`; 
          return <Cell key={`cell-${index}`} fill={corDinamica} />;
        })}
      </Pie>
    </PieChart>
  );

  const chartArea = (
    <AreaChart data={dadosAgrupados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" className={exportMode === 'pdf' ? "stroke-slate-200" : "stroke-slate-200 dark:stroke-slate-800"} />
      <XAxis dataKey="valorFormatado" stroke={axisColor} className="text-xs font-mono" />
      <YAxis allowDecimals={false} stroke={axisColor} className="text-xs font-mono" width={40} />
      <Tooltip formatter={(valor) => [valor, t("tools.descriptiveStats.graficos.area", "Acumulada")]} labelFormatter={(label) => `${t("tools.descriptiveStats.output.valor", "Valor")}: ${label}`} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
      <Area isAnimationActive={!exportMode} type="monotone" dataKey="acumulada" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
    </AreaChart>
  );

  const chartDispersao = (
    <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" className={exportMode === 'pdf' ? "stroke-slate-200" : "stroke-slate-200 dark:stroke-slate-800"} />
      <XAxis type="number" dataKey="indice" name="Índice" stroke={axisColor} className="text-xs font-mono" tickCount={dadosDispersao.length > 10 ? 10 : dadosDispersao.length} />
      <YAxis type="number" dataKey="valor" name="Valor" stroke={axisColor} className="text-xs font-mono" width={40} />
      <ZAxis range={[50, 50]} />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(valor, name) => [valor, name === 'Índice' ? t("tools.descriptiveStats.output.ordem", "Ordem") : t("tools.descriptiveStats.output.valor", "Valor")]} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
      <Scatter isAnimationActive={!exportMode} name="Valores" data={dadosDispersao} fill="#f43f5e" />
    </ScatterChart>
  );

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button type="button" onClick={() => setMostrarAjuda(true)} className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-xs font-semibold text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900">?</button>
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        <textarea
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={t("tools.descriptiveStats.placeholder", "Digite os números separados por vírgula...")}
          rows={3}
          className="w-full rounded-lg border border-brand-100 bg-white px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100"
        />
        <Button type="submit">{t("tools.descriptiveStats.calcular", "Calcular")}</Button>
      </form>

      {erro && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{t("common.erroPre")} {erro}</p>}

      {resultado && (
        <div className="mt-6 space-y-4">
          
          <ExportPanel
            isExporting={exportMode !== null}
            onExportImage={handleExportarGrafico}
            onExportPDF={handleExportarPDF}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard destaque label={t("tools.descriptiveStats.output.media")} value={fmt(resultado.media)} />
            <ResultCard destaque label={t("tools.descriptiveStats.output.mediana")} value={fmt(resultado.mediana)} />
            <ResultCard destaque label={t("tools.descriptiveStats.output.desvioPadrao")} value={fmt(resultado.desvioPadrao)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label={t("tools.descriptiveStats.output.minimo")} value={fmt(resultado.minimo)} />
            <ResultCard label={t("tools.descriptiveStats.output.maximo")} value={fmt(resultado.maximo)} />
            <ResultCard label={t("tools.descriptiveStats.output.amplitude")} value={fmt(resultado.amplitude)} />
            <ResultCard label={t("tools.descriptiveStats.output.contagem")} value={resultado.contagem} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultCard label={t("tools.descriptiveStats.output.moda")} value={formatarModa(resultado.moda)} />
            <ResultCard label={t("tools.descriptiveStats.output.variancia")} value={fmt(resultado.variancia)} />
          </div>

          <div
            ref={graficoRef}
            className={`rounded-lg ${exportMode ? "w-[640px]" : "w-full"} ${
              exportMode === 'pdf' ? "bg-white text-slate-800 p-8" :
              exportMode === 'png' ? "p-8 bg-white dark:bg-brand-950" :
              "border border-brand-100 dark:border-brand-900 bg-white dark:bg-brand-950 p-4"
            } ${exportMode ? "[&_.recharts-tooltip-wrapper]:!hidden" : ""}`}
          >
            {exportMode !== 'pdf' && (
              <>
                {!exportMode && (
                  <div className="flex gap-2 mb-6 border-b border-slate-100 dark:border-brand-900 pb-2 overflow-x-auto custom-scrollbar">
                    {[
                      { id: "barras", label: t("tools.descriptiveStats.graficos.barras", "Barras") },
                      { id: "pizza", label: t("tools.descriptiveStats.graficos.pizza", "Pizza") },
                      { id: "area", label: t("tools.descriptiveStats.graficos.area", "Acumulada") },
                      { id: "dispersao", label: t("tools.descriptiveStats.graficos.dispersao", "Dispersão") }
                    ].map((aba) => (
                      <button
                        key={aba.id}
                        type="button"
                        onClick={() => setGraficoAtivo(aba.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${graficoAtivo === aba.id ? "bg-brand-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-brand-900"}`}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>
                )}

                {exportMode === 'png' && (
                  <p className="font-mono text-xs mb-6 text-center uppercase tracking-wider text-brand-500 dark:text-brand-400">
                    {graficoAtivo === "barras" ? t("tools.descriptiveStats.graficos.barras", "Barras") : 
                     graficoAtivo === "pizza" ? t("tools.descriptiveStats.graficos.pizza", "Pizza") :
                     graficoAtivo === "area" ? t("tools.descriptiveStats.graficos.area", "Acumulada") :
                     t("tools.descriptiveStats.graficos.dispersao", "Dispersão")}
                  </p>
                )}

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {graficoAtivo === "barras" ? chartBarras :
                     graficoAtivo === "pizza" ? chartPizza :
                     graficoAtivo === "area" ? chartArea :
                     chartDispersao}
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {exportMode === 'pdf' && (
              // AQUI: Aumentamos o espaçamento vertical (gap-y-10)
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 mt-2">
                <div className="flex flex-col">
                  <p className="font-mono text-[10px] text-brand-500 mb-2 text-center uppercase">{t("tools.descriptiveStats.graficos.barras")}</p>
                  {/* AQUI: Aumentamos a altura de cada quadro de h-48 para h-56 */}
                  <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%">{chartBarras}</ResponsiveContainer></div>
                </div>
                <div className="flex flex-col">
                  <p className="font-mono text-[10px] text-brand-500 mb-2 text-center uppercase">{t("tools.descriptiveStats.graficos.pizza")}</p>
                  <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%">{chartPizza}</ResponsiveContainer></div>
                </div>
                <div className="flex flex-col">
                  <p className="font-mono text-[10px] text-brand-500 mb-2 text-center uppercase">{t("tools.descriptiveStats.graficos.area")}</p>
                  <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%">{chartArea}</ResponsiveContainer></div>
                </div>
                <div className="flex flex-col">
                  <p className="font-mono text-[10px] text-brand-500 mb-2 text-center uppercase">{t("tools.descriptiveStats.graficos.dispersao")}</p>
                  <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%">{chartDispersao}</ResponsiveContainer></div>
                </div>
              </div>
            )}

            {exportMode && (
              <div className={`mt-8 pt-4 border-t flex justify-between items-center ${exportMode === 'pdf' ? 'border-slate-200' : 'border-slate-100 dark:border-brand-900'}`}>
                <div className="flex items-center gap-2">
                  <img src="/favicon/web-app-manifest-192x192.png" alt="Logo" className="h-6 w-6 rounded-md" />
                  <span className={`font-display font-bold text-sm tracking-wide ${exportMode === 'pdf' ? 'text-slate-800' : 'text-slate-800 dark:text-slate-200'}`}>Math Hub</span>
                </div>
                <p className={`font-mono text-[10px] ${exportMode === 'pdf' ? 'text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>mathhub.app</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">{t("tools.descriptiveStats.output.ordenados")} ({resultado.contagem})</p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 leading-relaxed break-all">
              {resultado.numeros.map(fmt).join("  ·  ")}
            </p>
          </div>
        </div>
      )}

      <Modal
  isOpen={mostrarAjuda}
  onClose={() => setMostrarAjuda(false)}
  title={t('tools.descriptiveStats.ajuda.titulo')}
>
  <div>
    <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
      {t('tools.descriptiveStats.ajuda.entrada.titulo')}
    </p>
    <p>{t('tools.descriptiveStats.ajuda.entrada.desc')}</p>
  </div>
  <div>
    <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
      {t('tools.descriptiveStats.ajuda.metricas.titulo')}
    </p>
    <ul className="space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
      <li>{t('tools.descriptiveStats.ajuda.metricas.media')}</li>
      <li>{t('tools.descriptiveStats.ajuda.metricas.mediana')}</li>
      <li>{t('tools.descriptiveStats.ajuda.metricas.moda')}</li>
      <li>{t('tools.descriptiveStats.ajuda.metricas.desvioPadrao')}</li>
      <li>{t('tools.descriptiveStats.ajuda.metricas.variancia')}</li>
      <li>{t('tools.descriptiveStats.ajuda.metricas.amplitude')}</li>
    </ul>
  </div>
  <div>
    <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
      {t('tools.descriptiveStats.ajuda.moda.titulo')}
    </p>
    <p>{t('tools.descriptiveStats.ajuda.moda.desc')}</p>
  </div>
</Modal>
    </ToolCard>
  );
}

export default DescriptiveStats;