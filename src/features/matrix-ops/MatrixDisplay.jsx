import { fmt } from "./matrixOps";

/**
 * Exibe uma matriz formatada com bordas estilo notação matemática.
 */
function MatrixDisplay({ matriz, destaque = false }) {
  return (
    <div
      className={`rounded-lg p-3 inline-block ${
        destaque
          ? "bg-brand-50 dark:bg-brand-900/40"
          : "bg-slate-50 dark:bg-brand-950/60"
      }`}
    >
      <div
        className="grid gap-x-4 gap-y-1"
        style={{
          gridTemplateColumns: `repeat(${matriz[0].length}, minmax(2rem, auto))`,
        }}
      >
        {matriz.map((linha, i) =>
          linha.map((v, j) => (
            <span
              key={`${i}-${j}`}
              className={`font-mono text-sm text-center ${
                destaque
                  ? "text-brand-700 dark:text-brand-300 font-semibold"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {typeof v === "number" ? fmt(v) : v}
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export default MatrixDisplay;
