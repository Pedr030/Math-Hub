import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function ToolPage({ ferramentas, registroComponentes }) {
  const { slug } = useParams();
  const { t } = useTranslation();

  // Incrementado ao clicar em "Tentar novamente" — mudar o "key" do
  // ErrorBoundary força o React a desmontar e remontar a árvore inteira,
  // garantindo que o componente filho começa do zero sem estado de erro.
  const [retryKey, setRetryKey] = useState(0);

  const ferramenta = ferramentas.find((f) => f.id === slug);
  const Componente = ferramenta && registroComponentes[ferramenta.componente];
  // Passa o nome traduzido da ferramenta pro título — ou null se não encontrada
  const tituloFerramenta = ferramenta
    ? t(`ferramentas.${ferramenta.id}.nome`, { defaultValue: ferramenta.nome })
    : null;

  useDocumentTitle(tituloFerramenta);

  if (!ferramenta || !Componente) {
    return (
      <div className="text-center py-20">
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
    <>
      <Link
        to="/"
        className="inline-block mb-6 font-mono text-sm text-brand-500 hover:underline"
      >
        {t("toolPage.voltar")}
      </Link>

      <ErrorBoundary key={retryKey} onReset={() => setRetryKey((k) => k + 1)}>
        <Componente />
      </ErrorBoundary>
    </>
  );
}

export default ToolPage;
