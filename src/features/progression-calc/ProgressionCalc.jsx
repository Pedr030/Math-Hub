import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
import ExportPanel from "../../components/ui/ExportPanel";
import { PDF_CORES } from "../../utils/pdfColors";

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
  const [exportMode, setExportMode] = useState(null);

  const graficoRef = useRef(null);

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
      const res = modo === "pa" ? calcularPA(vA1, vRazao, vN) : calcularPG(vA1, vRazao, vN);
      setResultado(res);
    } catch (err) {
      setErro(err.message);
    }
  }

  const modos = ["pa", "pg", "identificar"];

  // Prepara os dados do gráfico para cálculos de PA/PG
  const dadosGrafico = resultado ? resultado.termos.map((val, idx) => ({
    indice: idx + 1,
    valorBruto: val
  })) : [];

  // Prepara os dados do gráfico para identificação
  const dadosIdentificacao = identificacao ? identificacao.nums.map((val, idx) => ({
    indice: idx + 1,
    valorBruto: val
  })) : [];

  const getBackgroundColor = () => {
    return document.documentElement.classList.contains("dark") ? "#020617" : "#ffffff";
  };

  const exportarGrafico = async () => {
    if (!graficoRef.current) return;
    setExportMode('png');

    setTimeout(async () => {
      try {
        const dataUrl = await toPng(graficoRef.current, {
          backgroundColor: getBackgroundColor(),
          pixelRatio: 2
        });
        const link = document.createElement("a");
        const baseName = t("tools.progressionCalc.output.nomeArquivoGrafico", "grafico_progressao");
        link.download = `${baseName}_${modo}.png`.replace(/\s+/g, '_').toLowerCase();
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Erro ao exportar gráfico", err);
      } finally {
        setExportMode(null);
      }
    }, 350);
  };

  const exportarRelatorioPDF = async () => {
    setExportMode('pdf');

    setTimeout(async () => {
      try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let currentY = 20;

        const isIdentificar = modo === "identificar";

        pdf.setFontSize(18);
        pdf.setTextColor(...PDF_CORES.slate900);
        const titulo = isIdentificar
          ? t("tools.progressionCalc.modos.identificar")
          : t(`tools.progressionCalc.modos.${modo}`);
        pdf.text(titulo.toUpperCase(), margin, currentY);
        currentY += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(...PDF_CORES.slate500);
        if (isIdentificar) {
          pdf.text(`${t("tools.progressionCalc.output.sequencia")}: ${identificacao.nums.map(fmt).join(", ")}`, margin, currentY, { maxWidth: pageWidth - margin * 2 });
        } else {
          const resumo = `a₁: ${fmt(resultado.a1)}   |   ${t("tools.progressionCalc.output.razao")}: ${fmt(resultado.razao)}   |   n: ${resultado.n}`;
          pdf.text(resumo, margin, currentY);
        }
        currentY += 12;

        pdf.setFontSize(12);
        pdf.setTextColor(...PDF_CORES.brand400);
        pdf.setFont(undefined, 'bold');
        if (isIdentificar) {
          const paTxt = `PA ${identificacao.tipoPA ? `✓ (r = ${fmt(identificacao.razaoPA)})` : "✗"}`;
          const pgTxt = `PG ${identificacao.tipoPG ? `✓ (q = ${fmt(identificacao.razaoPG)})` : "✗"}`;
          pdf.text(paTxt, margin, currentY);
          pdf.text(pgTxt, pageWidth / 2, currentY);
        } else {
          pdf.text(`${t("tools.progressionCalc.output.an")}: ${fmt(resultado.an)}`, margin, currentY);
          pdf.text(`${t("tools.progressionCalc.output.soma")}: ${fmt(resultado.soma)}`, pageWidth / 2, currentY);
        }
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
          const padding = 4;
          pdf.setFillColor(...PDF_CORES.cardBg);
          pdf.setDrawColor(...PDF_CORES.cardBorder);
          pdf.setLineWidth(0.3);
          pdf.roundedRect(
            margin - padding,
            currentY - padding,
            printWidth + padding * 2,
            printHeight + padding * 2,
            2, 2, 'FD'
          );
          pdf.addImage(dataUrl, "JPEG", margin, currentY, printWidth, printHeight);
          currentY += printHeight + 15;
        }

        const termosArray = isIdentificar ? identificacao.nums : resultado.termos;
        const tableBody = termosArray.map((valor, idx) => [idx + 1, fmt(valor)]);

        autoTable(pdf, {
          startY: currentY,
          head: [[
            t("tools.progressionCalc.output.indice", "Índice"),
            t("tools.progressionCalc.output.termo", "Termo")
          ]],
          body: tableBody,
          theme: 'striped',
          headStyles: { fillColor: [14, 165, 233], textColor: 255 },
          styles: { fontSize: 9, halign: 'center', cellPadding: 3 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: margin, right: margin, bottom: 20 }
        });

        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(...PDF_CORES.slate400);
          const footerStr = `${t("common.exportar.marcaDagua", "Gerado por Math Hub")} - mathhub.app`;
          pdf.text(footerStr, margin, pageHeight - 10);
          pdf.text(`${i} / ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        const baseName = t("tools.progressionCalc.output.nomeArquivoPdf", "relatorio_progressao");
        pdf.save(`${baseName}_${modo}.pdf`.replace(/\s+/g, '_').toLowerCase());
      } catch (err) {
        console.error("Erro ao exportar PDF", err);
      } finally {
        setExportMode(null);
      }
    }, 350);
  };

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t('tools.progressionCalc.ajuda.titulo')}
          title={t('tools.progressionCalc.ajuda.titulo')}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-xs font-semibold text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

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
              ${modo === m ? "bg-brand-500 text-white" : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"}`}
          >
            {t(`tools.progressionCalc.modos.${m}`)}
          </button>
        ))}
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        {modo === "identificar" ? (
          <Input value={sequencia} onChange={(e) => setSequencia(e.target.value)} placeholder={t("tools.progressionCalc.placeholderSeq")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-xs text-brand-500 mb-1">{t("tools.progressionCalc.campos.a1")}</label>
              <Input type="number" step="any" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="Ex: 2" />
            </div>
            <div>
              <label className="block font-mono text-xs text-brand-500 mb-1">{t(`tools.progressionCalc.campos.razao${modo === "pa" ? "PA" : "PG"}`)}</label>
              <Input type="number" step="any" value={razao} onChange={(e) => setRazao(e.target.value)} placeholder={modo === "pa" ? "Ex: 3" : "Ex: 2"} />
            </div>
            <div>
              <label className="block font-mono text-xs text-brand-500 mb-1">{t("tools.progressionCalc.campos.n")}</label>
              <Input type="number" step="1" min="1" max="100" value={n} onChange={(e) => setN(e.target.value)} placeholder="Ex: 6" />
            </div>
          </div>
        )}
        <Button type="submit">
          {modo === "identificar" ? t("tools.progressionCalc.identificar") : t("tools.progressionCalc.calcular")}
        </Button>
      </form>

      {erro && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{t("common.erroPre")} {erro}</p>}

      {resultado && (
        <div className="mt-6 space-y-4">
          <ExportPanel
            isExporting={exportMode !== null}
            onExportImage={exportarGrafico}
            onExportPDF={exportarRelatorioPDF}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard destaque label={t("tools.progressionCalc.output.an")} value={fmt(resultado.an)} />
            <ResultCard destaque label={t("tools.progressionCalc.output.soma")} value={fmt(resultado.soma)} />
            <ResultCard label={t("tools.progressionCalc.output.a1")} value={fmt(resultado.a1)} />
            <ResultCard label={t("tools.progressionCalc.output.razao")} value={fmt(resultado.razao)} />
          </div>

          {/* GRÁFICO DA PROGRESSÃO */}
          <div
            ref={graficoRef}
            className={`w-full rounded-lg ${
              exportMode === 'pdf'
                ? "bg-white text-slate-800 p-8"
                : exportMode === 'png'
                ? "p-8 bg-white dark:bg-brand-950"
                : "border border-brand-100 dark:border-brand-900 bg-white dark:bg-brand-950 p-4"
            }`}
          >
            <p className={`font-mono text-xs mb-3 ${exportMode === 'pdf' ? 'text-brand-500 text-center uppercase tracking-wider' : 'text-brand-500'}`}>
              {t("tools.progressionCalc.output.grafico", "Comportamento da Sequência")}
            </p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className={exportMode === 'pdf' ? "stroke-slate-200" : "stroke-slate-200 dark:stroke-slate-800"} />
                  <XAxis dataKey="indice" stroke="currentColor" className="text-xs text-slate-400 font-mono" />
                  <YAxis stroke="currentColor" className="text-xs text-slate-400 font-mono" width={40} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                  <Tooltip
                    formatter={(valor) => [fmt(valor), t("tools.progressionCalc.output.valor", "Valor")]}
                    labelFormatter={(label) => `${t("tools.progressionCalc.output.termo", "Termo")}: ${label}`}
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line isAnimationActive={!exportMode} type="monotone" dataKey="valorBruto" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

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
              <p className="font-mono text-xs text-brand-500">{t("tools.progressionCalc.output.termos", { n: resultado.n })}</p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{resultado.termos.map(fmt).join("  ·  ")}</p>
          </div>
        </div>
      )}

      {identificacao && (
        <div className="mt-6 space-y-3">
          <ExportPanel
            isExporting={exportMode !== null}
            onExportImage={exportarGrafico}
            onExportPDF={exportarRelatorioPDF}
          />

          <div className="flex gap-3 flex-wrap">
            <div className={`rounded-lg px-4 py-2 text-sm font-medium ${identificacao.tipoPA ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-slate-50 text-slate-400 dark:bg-brand-950/60 dark:text-slate-500"}`}>
              PA {identificacao.tipoPA ? `✓ (r = ${fmt(identificacao.razaoPA)})` : "✗"}
            </div>
            <div className={`rounded-lg px-4 py-2 text-sm font-medium ${identificacao.tipoPG ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-slate-50 text-slate-400 dark:bg-brand-950/60 dark:text-slate-500"}`}>
              PG {identificacao.tipoPG ? `✓ (q = ${fmt(identificacao.razaoPG)})` : "✗"}
            </div>
          </div>

          {!identificacao.tipoPA && !identificacao.tipoPG && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("tools.progressionCalc.output.nenhuma")}</p>
          )}

          {/* GRÁFICO DA SEQUÊNCIA IDENTIFICADA */}
          <div
            ref={graficoRef}
            className={`w-full rounded-lg mt-4 ${
              exportMode === 'pdf'
                ? "bg-white text-slate-800 p-8"
                : exportMode === 'png'
                ? "p-8 bg-white dark:bg-brand-950"
                : "border border-brand-100 dark:border-brand-900 bg-white dark:bg-brand-950 p-4"
            }`}
          >
            <p className={`font-mono text-xs mb-3 ${exportMode === 'pdf' ? 'text-brand-500 text-center uppercase tracking-wider' : 'text-brand-500'}`}>
              {t("tools.progressionCalc.output.grafico", "Comportamento da Sequência")}
            </p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosIdentificacao} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className={exportMode === 'pdf' ? "stroke-slate-200" : "stroke-slate-200 dark:stroke-slate-800"} />
                  <XAxis dataKey="indice" stroke="currentColor" className="text-xs text-slate-400 font-mono" />
                  <YAxis stroke="currentColor" className="text-xs text-slate-400 font-mono" width={40} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                  <Tooltip
                    formatter={(valor) => [fmt(valor), t("tools.progressionCalc.output.valor", "Valor")]}
                    labelFormatter={(label) => `${t("tools.progressionCalc.output.termo", "Termo")}: ${label}`}
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line isAnimationActive={!exportMode} type="monotone" dataKey="valorBruto" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

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
              <p className="font-mono text-xs text-brand-500">{t("tools.progressionCalc.output.sequencia")}</p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{identificacao.nums.map(fmt).join("  ·  ")}</p>
          </div>
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t('tools.progressionCalc.ajuda.titulo')}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t('tools.progressionCalc.ajuda.pa.titulo')}
          </p>
          <p>{t('tools.progressionCalc.ajuda.pa.desc')}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t('tools.progressionCalc.ajuda.pg.titulo')}
          </p>
          <p>{t('tools.progressionCalc.ajuda.pg.desc')}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t('tools.progressionCalc.ajuda.identificar.titulo')}
          </p>
          <p>{t('tools.progressionCalc.ajuda.identificar.desc')}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default ProgressionCalc;