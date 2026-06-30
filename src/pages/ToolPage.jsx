import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ToolPage({ ferramentas, registroComponentes }) {
  const { slug } = useParams();
  const { t } = useTranslation();

  const ferramenta = ferramentas.find((f) => f.id === slug);
  const Componente = ferramenta && registroComponentes[ferramenta.componente];

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
      <Componente />
    </>
  );
}

export default ToolPage;
