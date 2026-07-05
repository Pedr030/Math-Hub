import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function Home({ ferramentas, registroComponentes }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [busca, setBusca] = useState("");
  const [tagAtiva, setTagAtiva] = useState(null);
  useDocumentTitle(null); // null = usa só "Math Hub"

  // Extrai todas as tags únicas das ferramentas ativas, na ordem
  // em que aparecem (sem repetir). useMemo evita recalcular a cada render.
  const todasTags = useMemo(() => {
    const vistas = new Set();
    const lista = [];
    ferramentas
      .filter((f) => f.ativo)
      .forEach((f) =>
        (f.tags || []).forEach((tag) => {
          if (!vistas.has(tag)) {
            vistas.add(tag);
            lista.push(tag);
          }
        }),
      );
    return lista;
  }, [ferramentas]);

  // Aplica os dois filtros combinados: busca por texto + tag ativa.
  // Antes: .filter((f) => f.ativo)
  // Agora: mostra todas, inativas aparecem com badge
  const ferramentasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return (
      ferramentas
        .filter((f) => {
          const nomeTraducido = t(`ferramentas.${f.id}.nome`, {
            defaultValue: f.nome,
          }).toLowerCase();
          const descTraducida = t(`ferramentas.${f.id}.descricao`, {
            defaultValue: f.descricao,
          }).toLowerCase();
          const bateTexto =
            !termo ||
            nomeTraducido.includes(termo) ||
            descTraducida.includes(termo);
          const bateTag = !tagAtiva || (f.tags || []).includes(tagAtiva);
          return bateTexto && bateTag;
        })
        // Ativas sempre antes das "Em breve"
        .sort((a, b) => Number(b.ativo) - Number(a.ativo))
    );
  }, [ferramentas, busca, tagAtiva, t]);

  function handleTagClick(tag) {
    // Clicar na tag ativa a deseleciona (toggle)
    setTagAtiva((atual) => (atual === tag ? null : tag));
  }

  return (
    <div className="animate-fadein">
      <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-2">
        {t("home.prefixo")}
      </p>
      <h2 className="font-display text-2xl font-semibold mb-6">
        {t("home.titulo")}
      </h2>

      {/* Barra de busca */}
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder={t("home.busca.placeholder")}
        className="w-full rounded-lg border border-brand-100 bg-white px-4 py-2 font-body
                   text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 mb-4
                   dark:border-brand-800 dark:bg-brand-950 dark:text-slate-100"
      />

      {/* Chips de tag */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setTagAtiva(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors
            ${
              !tagAtiva
                ? "bg-brand-500 text-white"
                : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
            }`}
        >
          {t("home.busca.todosLabel")}
        </button>
        {todasTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors
              ${
                tagAtiva === tag
                  ? "bg-brand-500 text-white"
                  : "border border-brand-200 text-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900"
              }`}
          >
            {t(`tags.${tag}`, { defaultValue: tag })}
          </button>
        ))}
      </div>
      {ferramentasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-4">🔍</span>
          <p className="font-display font-semibold text-lg mb-1">
            {t("home.busca.semResultados")}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
            {t("home.busca.semResultadosDica")}
          </p>
          <button
            onClick={() => {
              setBusca("");
              setTagAtiva(null);
            }}
            className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium
                 text-brand-500 hover:bg-brand-50 transition-colors
                 dark:border-brand-700 dark:hover:bg-brand-900"
          >
            {t("home.busca.limpar")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ferramentasFiltradas.map((ferramenta) => {
            const temComponente = Boolean(
              registroComponentes[ferramenta.componente],
            );

            return (
              <article
                key={ferramenta.id}
                onClick={() =>
                  ferramenta.ativo && temComponente && navigate(ferramenta.rota)
                }
                className={`rounded-xl border p-5 shadow-sm transition-shadow flex flex-col
                  border-brand-100 bg-white dark:border-brand-900 dark:bg-brand-900/40
                  ${ferramenta.destaque ? "ring-1 ring-brand-300 dark:ring-brand-700" : ""}
                  ${temComponente ? "cursor-pointer hover:shadow-md" : "opacity-60"}
                  ${ferramenta.ativo && temComponente ? "cursor-pointer hover:shadow-md" : "cursor-default opacity-50"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-lg">
                    {t(`ferramentas.${ferramenta.id}.nome`, {
                      defaultValue: ferramenta.nome,
                    })}
                  </h3>
                  {!ferramenta.ativo && (
                    <span
                      className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-mono
                     text-xs text-slate-400 dark:bg-brand-900 dark:text-slate-500"
                    >
                      {t("home.emBreve")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 flex-1">
                  {t(`ferramentas.${ferramenta.id}.descricao`, {
                    defaultValue: ferramenta.descricao,
                  })}
                </p>

                {/* Tags no card */}
                {(ferramenta.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
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
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
