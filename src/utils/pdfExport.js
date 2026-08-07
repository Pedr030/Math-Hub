import { jsPDF } from "jspdf";
import { toJpeg } from "html-to-image";
import { PDF_CORES } from "./pdfColors";

/**
 * Boilerplate de jsPDF repetido em toda ferramenta que gera relatório:
 * criar o documento, embutir o gráfico capturado num card, e fechar
 * com rodapé + numeração de página antes de salvar. O conteúdo entre
 * essas duas pontas (título, resumo, tabela) é específico de cada
 * ferramenta e continua no componente.
 */
export function criarPDF() {
  const pdf = new jsPDF("p", "mm", "a4");
  return {
    pdf,
    pageWidth: pdf.internal.pageSize.getWidth(),
    pageHeight: pdf.internal.pageSize.getHeight(),
    margin: 15,
  };
}

/**
 * Captura o gráfico (via graficoRef) como JPEG, desenha um card com
 * fundo/borda por trás dele e o insere no PDF. Retorna o novo currentY,
 * já somado o espaço ocupado pela imagem.
 */
export async function desenharGraficoComCard(pdf, { graficoRef, currentY, margin, pageWidth }) {
  if (!graficoRef.current) return currentY;

  const dataUrl = await toJpeg(graficoRef.current, {
    backgroundColor: "#ffffff",
    quality: 0.95,
    pixelRatio: 1.5,
  });

  const imgProps = pdf.getImageProperties(dataUrl);
  const printWidth = pageWidth - margin * 2;
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
    2,
    2,
    "FD",
  );
  pdf.addImage(dataUrl, "JPEG", margin, currentY, printWidth, printHeight);

  return currentY + printHeight + 15;
}

/** Escreve o rodapé (marca d'água + "N / total") em todas as páginas e salva o arquivo. */
export function adicionarRodapeEBaixar(pdf, { margin, pageWidth, pageHeight, nomeArquivo, marcaDagua }) {
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...PDF_CORES.slate400);
    pdf.text(`${marcaDagua} - mathhub.app`, margin, pageHeight - 10);
    pdf.text(`${i} / ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }
  pdf.save(nomeArquivo);
}
