import { useTranslation } from "react-i18next";

function ExportPanel({ isExporting, onExportImage, onExportPDF }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3 justify-end border-b border-brand-100 dark:border-brand-900 pb-4">
      {onExportImage && (
        <button
          onClick={onExportImage}
          disabled={isExporting}
          className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/50 transition-colors disabled:opacity-50"
        >
          {isExporting
            ? t("common.exportar.exportando", "Exportando...")
            : t("common.exportar.grafico", "Baixar Gráfico (PNG)")}
        </button>
      )}
      
      {onExportPDF && (
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {isExporting
            ? t("common.exportar.exportando", "Exportando...")
            : t("common.exportar.relatorio", "Baixar Relatório (PDF)")}
        </button>
      )}
    </div>
  );
}

export default ExportPanel;