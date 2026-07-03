import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BASES,
  ehValido,
  converterParaTodas,
  passosConversao,
} from "./baseConverter";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

function BaseConverter() {
  const { t } = useTranslation();

  const [valor, setValor] = useState("");
  const [baseOrigem, setBaseOrigem] = useState(10);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarPassos, setMostrarPassos] = useState(false);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);
    setMostrarPassos(false);

    if (!valor.trim()) {
      setErro(t("tools.baseConverter.erros.vazio"));
      return;
    }

    if (!ehValido(valor, baseOrigem)) {
      setErro(t("tools.baseConverter.erros.invalido", { base: baseOrigem }));
      return;
    }

    try {
      const conversoes = converterParaTodas(valor, baseOrigem);
      const decimal = parseInt(valor.trim(), baseOrigem);
      setResultado({ conversoes, decimal });
    } catch (err) {
      setErro(err.message);
    }
  }

  // Rótulo de cada base na UI
  function rotuloBase(base) {
    return t(`tools.baseConverter.bases.${base}`);
  }

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.baseConverter.ajuda.titulo")}
          title={t("tools.baseConverter.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        {/* Seletor de base */}
        <div className="flex gap-2 flex-wrap">
          {BASES.map(({ base, nome }) => (
            <button
              key={base}
              type="button"
              onClick={() => {
                setBaseOrigem(base);
                setResultado(null);
                setErro(null);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
                ${
                  baseOrigem === base
                    ? "bg-brand-500 text-white"
                    : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
                }`}
            >
              {nome}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={valor}
            onChange={(e) => setValor(e.target.value.toUpperCase())}
            placeholder={t("tools.baseConverter.placeholder", {
              base: rotuloBase(baseOrigem),
            })}
          />
          <Button type="submit">{t("tools.baseConverter.converter")}</Button>
        </div>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {/* Resultado: as 4 bases lado a lado */}
      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BASES.map(({ base, prefixo, nome }) => {
              const ehOrigem = base === baseOrigem;
              return (
                <div
                  key={base}
                  className={`rounded-lg p-3 ${
                    ehOrigem
                      ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/40 dark:ring-brand-700"
                      : "bg-slate-50 dark:bg-brand-950/60"
                  }`}
                >
                  <p className="font-mono text-xs text-slate-400 mb-1">
                    {nome} (base {base})
                    {ehOrigem && ` · ${t("tools.baseConverter.origem")}`}
                  </p>
                  <p
                    className={`font-mono font-semibold break-all ${
                      ehOrigem
                        ? "text-brand-600 dark:text-brand-300"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className="text-slate-300 dark:text-slate-600 select-none">
                      {prefixo}
                    </span>
                    {resultado.conversoes[base]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Passos da conversão decimal → base origem */}
          {baseOrigem !== 10 && (
            <div>
              <button
                type="button"
                onClick={() => setMostrarPassos((v) => !v)}
                className="font-mono text-xs text-brand-500 hover:underline"
              >
                {mostrarPassos
                  ? t("tools.baseConverter.ocultarPassos")
                  : t("tools.baseConverter.verPassos", { base: baseOrigem })}
              </button>

              {mostrarPassos && (
                <div className="mt-3 rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
                  <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
                    <p className="font-mono text-xs text-brand-500">
                      {t("tools.baseConverter.passosTitle", {
                        decimal: resultado.decimal,
                        base: baseOrigem,
                      })}
                    </p>
                  </div>
                  <div className="divide-y divide-brand-50 dark:divide-brand-900/50">
                    {passosConversao(resultado.decimal, baseOrigem).map(
                      (p, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 font-mono text-xs text-slate-500 dark:text-slate-400"
                        >
                          {p.dividendo} ÷ {baseOrigem} = {p.quociente}{" "}
                          <span className="text-brand-500">
                            (resto {p.resto.toString(baseOrigem).toUpperCase()})
                          </span>
                        </div>
                      ),
                    )}
                    <div className="px-4 py-2 font-mono text-xs text-slate-400 dark:text-slate-500">
                      {t("tools.baseConverter.lendoResto")} →{" "}
                      <span className="text-brand-500 font-semibold">
                        {resultado.conversoes[baseOrigem]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t("tools.baseConverter.ajuda.titulo")}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.baseConverter.ajuda.oQueE.titulo")}
          </p>
          <p>{t("tools.baseConverter.ajuda.oQueE.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.baseConverter.ajuda.comoUsar.titulo")}
          </p>
          <p>{t("tools.baseConverter.ajuda.comoUsar.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t("tools.baseConverter.ajuda.passos.titulo")}
          </p>
          <p>{t("tools.baseConverter.ajuda.passos.desc")}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default BaseConverter;
