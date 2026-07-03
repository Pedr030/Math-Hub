import Input from "../../components/ui/Input";

/**
 * Grid de inputs para uma matriz N×N.
 * Componente separado porque aparece duas vezes na UI (matriz A e B).
 */
function MatrixInput({ label, matriz, onChange, tamanho }) {
  return (
    <div>
      {label && (
        <p className="font-mono text-xs text-brand-500 mb-2 uppercase tracking-wide">
          {label}
        </p>
      )}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${tamanho}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: tamanho }, (_, i) =>
          Array.from({ length: tamanho }, (__, j) => (
            <Input
              key={`${i}-${j}`}
              type="number"
              step="any"
              placeholder="0"
              value={matriz[i][j]}
              onChange={(e) => onChange(i, j, e.target.value)}
              className="text-center px-1"
            />
          )),
        )}
      </div>
    </div>
  );
}

export default MatrixInput;
