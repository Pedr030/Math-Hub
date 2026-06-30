import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resolverSistema } from "./matrix3";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import OutputPanel from "../../components/ui/OutputPanel";

const MATRIZ_VAZIA = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
const VETOR_VAZIO = ["", "", ""];

function MatrixCircuit() {
  const { t } = useTranslation();

  const [matriz, setMatriz] = useState(MATRIZ_VAZIA);
  const [vetor, setVetor] = useState(VETOR_VAZIO);
  const [resultado, setResultado] = useState(null); // { correntes, verificacao }
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  function handleChangeR(i, j, valor) {
    setMatriz((prev) => {
      const nova = prev.map((linha) => [...linha]);
      nova[i][j] = valor;
      return nova;
    });
  }

  function handleChangeV(i, valor) {
    setVetor((prev) => {
      const novo = [...prev];
      novo[i] = valor;
      return novo;
    });
  }

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    const camposVazios =
      matriz.some((linha) => linha.some((v) => v.trim() === "")) ||
      vetor.some((v) => v.trim() === "");
    if (camposVazios) {
      setErro(t("circuito.erros.camposVazios"));
      return;
    }

    const matrizNum = matriz.map((linha) => linha.map(Number));
    const vetorNum = vetor.map(Number);

    const temNaN =
      matrizNum.some((linha) => linha.some(Number.isNaN)) ||
      vetorNum.some(Number.isNaN);
    if (temNaN) {
      setErro(t("circuito.erros.numerosInvalidos"));
      return;
    }

    // Mesma validação do circuito.py: toda resistência precisa ser positiva
    const resistenciaInvalida = matrizNum.some((linha) =>
      linha.some((r) => r <= 0),
    );
    if (resistenciaInvalida) {
      setErro(t("circuito.erros.resistenciaPositiva"));
      return;
    }

    const correntes = resolverSistema(matrizNum, vetorNum);
    if (!correntes) {
      setErro(t("circuito.erros.semSolucao"));
      return;
    }

    // Verificação: substitui as correntes de volta nas equações originais
    const verificacao = matrizNum.map((linha, i) => ({
      calculado: linha.reduce((soma, r, j) => soma + r * correntes[j], 0),
      esperado: vetorNum[i],
    }));

    setResultado({ correntes, verificacao });
  }

  const outputRows = resultado
    ? resultado.correntes.map((valor, i) => ({
        label: t("circuito.output.corrente", { n: i + 1 }),
        value: `${valor.toFixed(3)} A`,
        large: true,
      }))
    : [];

  return (
    <ToolCard>
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-xs uppercase tracking-wide text-brand-500">
          {t("circuito.prefixo")}
        </p>
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("circuito.ajuda.titulo")}
          title={t("circuito.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      <h3 className="font-display text-xl font-semibold mb-1">
        {t("circuito.titulo")}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {t("circuito.subtitulo")}
      </p>

      <form onSubmit={handleCalcular} className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <p className="font-mono text-xs text-brand-500 mb-1">
              {t("circuito.malha", { n: i + 1 })}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[0, 1, 2].map((j) => (
                <Input
                  key={j}
                  type="number"
                  step="any"
                  placeholder={`R${i + 1}${j + 1} (Ω)`}
                  value={matriz[i][j]}
                  onChange={(e) => handleChangeR(i, j, e.target.value)}
                />
              ))}
              <Input
                type="number"
                step="any"
                placeholder={`V${i + 1} (V)`}
                value={vetor[i]}
                onChange={(e) => handleChangeV(i, e.target.value)}
              />
            </div>
          </div>
        ))}

        <Button type="submit">{t("circuito.calcular")}</Button>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("calc.erroPre")} {erro}
        </p>
      )}

      <OutputPanel rows={outputRows} />

      {resultado && (
        <div className="mt-4 rounded-lg bg-slate-50 p-4 font-mono text-xs space-y-1 dark:bg-brand-950/60">
          <p className="text-slate-400 mb-1">
            {t("circuito.output.verificacao")}:
          </p>
          {resultado.verificacao.map((v, i) => (
            <p key={i} className="text-slate-600 dark:text-slate-300">
              {t("circuito.malha", { n: i + 1 })}: {v.calculado.toFixed(3)} V (
              {t("circuito.output.esperado")}: {v.esperado} V)
            </p>
          ))}
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("circuito.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("circuito.ajuda.oQueE.titulo")}
          </p>
          <p>{t("circuito.ajuda.oQueE.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("circuito.ajuda.comoPreencher.titulo")}
          </p>
          <p>{t("circuito.ajuda.comoPreencher.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("circuito.ajuda.resultado.titulo")}
          </p>
          <p>{t("circuito.ajuda.resultado.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default MatrixCircuit;
