import { useState, useRef } from "react";
import { toPng } from "html-to-image";

/**
 * Estado e ações compartilhadas por toda ferramenta que exporta um
 * gráfico (PNG) ou relatório (PDF) a partir de um container renderizado.
 * O conteúdo do PDF em si (título, resumo, tabela) fica no componente —
 * aqui só o ciclo de vida comum: exportMode, ref do container, cor de
 * eixo/texto segura pra exportação, e o wrapping de erro/timeout.
 */
export function useChartExport() {
  const [exportMode, setExportMode] = useState(null);
  const graficoRef = useRef(null);

  const isDark = document.documentElement.classList.contains("dark");
  // Cor de eixo/texto explícita (não "currentColor") — garante contraste
  // correto na imagem capturada, independente de como o html-to-image
  // resolve herança de CSS no clone do DOM.
  const axisColor = exportMode === "pdf" ? "#475569" : isDark ? "#94a3b8" : "#64748b";

  const getBackgroundColor = () =>
    document.documentElement.classList.contains("dark") ? "#020617" : "#ffffff";

  function exportarGrafico(nomeArquivo) {
    if (!graficoRef.current) return;
    setExportMode("png");

    setTimeout(async () => {
      try {
        const dataUrl = await toPng(graficoRef.current, {
          backgroundColor: getBackgroundColor(),
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = nomeArquivo;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Erro ao exportar gráfico", err);
      } finally {
        setExportMode(null);
      }
    }, 350);
  }

  function exportarPDF(gerarPDF) {
    setExportMode("pdf");

    setTimeout(async () => {
      try {
        await gerarPDF();
      } catch (err) {
        console.error("Erro ao exportar PDF", err);
      } finally {
        setExportMode(null);
      }
    }, 350);
  }

  return { exportMode, graficoRef, isDark, axisColor, exportarGrafico, exportarPDF };
}
