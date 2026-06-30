import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home({ ferramentas, registroComponentes }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-2">
        {t("home.prefixo")}
      </p>
      <h2 className="font-display text-2xl font-semibold mb-8">
        {t("home.titulo")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ferramentas
          .filter((f) => f.ativo)
          .map((ferramenta) => {
            const temComponente = Boolean(
              registroComponentes[ferramenta.componente],
            );

            return (
              <article
                key={ferramenta.id}
                onClick={() => temComponente && navigate(ferramenta.rota)}
                className={`rounded-xl border p-5 shadow-sm transition-shadow
                  border-brand-100 bg-white dark:border-brand-900 dark:bg-brand-900/40
                  ${ferramenta.destaque ? "ring-1 ring-brand-300 dark:ring-brand-700" : ""}
                  ${temComponente ? "cursor-pointer hover:shadow-md" : "opacity-60"}`}
              >
                <h3 className="font-display font-semibold text-lg">
                  {t(`ferramentas.${ferramenta.id}.nome`, {
                    defaultValue: ferramenta.nome,
                  })}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {t(`ferramentas.${ferramenta.id}.descricao`, {
                    defaultValue: ferramenta.descricao,
                  })}
                </p>
              </article>
            );
          })}
      </div>
    </>
  );
}

export default Home;
