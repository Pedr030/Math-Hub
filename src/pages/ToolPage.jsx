import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function ToolPage({ ferramentas, registroComponentes }) {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [retryKey, setRetryKey] = useState(0);

  const ferramenta = ferramentas.find((f) => f.id === slug);
  const Componente = ferramenta && registroComponentes[ferramenta.componente];

  const tituloFerramenta = ferramenta
    ? t(`ferramentas.${ferramenta.id}.nome`, { defaultValue: ferramenta.nome })
    : null;

  useDocumentTitle(tituloFerramenta);

  if (!ferramenta || !Componente) {
    return (
      <div className="animate-fadein text-center py-20">
        <p className="font-mono text-brand-500 text-sm mb-2">404</p>
        <p className="font-display text-xl font-semibold mb-4">
          {t("toolPage.naoEncontrada")}
        </p>
        <Link
          to="/"
          className="font-mono text-sm text-brand-500 hover:underline"
        >
          {t("toolPage.voltar")}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadein">
      {/* Navegação */}
      <Link
        to="/"
        className="inline-block mb-8 font-mono text-sm text-brand-500 hover:underline"
      >
        {t("toolPage.voltar")}
      </Link>

      {/* Cabeçalho da ferramenta — dados vindos do projetos.json */}
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-1">
          {t(
            `tools.${ferramenta.componente.charAt(0).toLowerCase() + ferramenta.componente.slice(1)}.prefixo`,
            { defaultValue: `ferramentas/${ferramenta.id}` },
          )}
        </p>
        <h1 className="font-display text-2xl font-semibold mb-2">
          {tituloFerramenta}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t(`ferramentas.${ferramenta.id}.descricao`, {
            defaultValue: ferramenta.descricao,
          })}
        </p>

        {/* Tags da ferramenta */}
        {(ferramenta.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ferramenta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-2 py-0.5 font-mono text-xs
                           text-brand-500 dark:bg-brand-900 dark:text-brand-300"
              >
                {t(`tags.${tag}`, { defaultValue: tag })}
              </span>
            ))}
          </div>
        )}
      </div>

      <ErrorBoundary key={retryKey} onReset={() => setRetryKey((k) => k + 1)}>
        <Componente />
      </ErrorBoundary>
    </div>
  );
}

export default ToolPage;
