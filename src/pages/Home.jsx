import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFavoritos } from "../hooks/useFavoritos";

// Ícone de estrela — preenchida ou vazia conforme o estado
function StarIcon({ preenchida }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={preenchida ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Card de ferramenta — reutilizado na seção de favoritos e na grade
function ToolCard({
  ferramenta,
  onClick,
  ehFavorito,
  onToggleFavorito,
  t,
  mini = false,
}) {
  const temComponente = Boolean(onClick);

  return (
    <article
      onClick={() => temComponente && ferramenta.ativo && onClick()}
      className={`relative rounded-xl border p-5 shadow-sm transition-shadow flex flex-col
        border-brand-100 bg-white dark:border-brand-900 dark:bg-brand-900/40
        ${ferramenta.destaque ? "ring-1 ring-brand-300 dark:ring-brand-700" : ""}
        ${ferramenta.ativo && temComponente ? "cursor-pointer hover:shadow-md" : ""}
        ${!ferramenta.ativo ? "cursor-default opacity-50" : ""}
        ${mini ? "p-3" : "p-5"}`}
    >
      {/* Botão de favorito */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorito(ferramenta.id);
        }}
        aria-label={
          ehFavorito
            ? t("home.favoritos.remover")
            : t("home.favoritos.adicionar")
        }
        className={`absolute top-3 right-3 rounded-full p-1 transition-colors
          ${
            ehFavorito
              ? "text-brand-500 dark:text-brand-300"
              : "text-slate-300 hover:text-brand-400 dark:text-slate-600 dark:hover:text-brand-500"
          }`}
      >
        <StarIcon preenchida={ehFavorito} />
      </button>

      <div className="flex items-start justify-between gap-6">
        <h3
          className={`font-display font-semibold ${mini ? "text-base" : "text-lg"} pr-4`}
        >
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

      {!mini && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 flex-1">
          {t(`ferramentas.${ferramenta.id}.descricao`, {
            defaultValue: ferramenta.descricao,
          })}
        </p>
      )}

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
}

function Home({ ferramentas, registroComponentes }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { favoritos, alternarFavorito, ehFavorito } = useFavoritos();

  const [busca, setBusca] = useState("");
  const [tagAtiva, setTagAtiva] = useState(null);

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

  const ferramentasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return ferramentas
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
      .sort((a, b) => Number(b.ativo) - Number(a.ativo));
  }, [ferramentas, busca, tagAtiva, t]);

  // Ferramentas favoritas (na ordem que foram favoritadas)
  const ferramentasFavoritas = useMemo(
    () =>
      favoritos
        .map((id) => ferramentas.find((f) => f.id === id))
        .filter(Boolean),
    [favoritos, ferramentas],
  );

  function handleNavigate(ferramenta) {
    if (ferramenta.ativo && registroComponentes[ferramenta.componente]) {
      navigate(ferramenta.rota);
    }
  }

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-2">
        {t("home.prefixo")}
      </p>
      <h2 className="font-display text-2xl font-semibold mb-6">
        {t("home.titulo")}
      </h2>

      {/* Seção de favoritos — só aparece se tiver pelo menos um */}
      {ferramentasFavoritas.length > 0 && (
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-wide text-brand-400 dark:text-brand-600 mb-3">
            ★ {t("home.favoritos.titulo")}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ferramentasFavoritas.map((ferramenta) => (
              <ToolCard
                key={ferramenta.id}
                ferramenta={ferramenta}
                onClick={() => handleNavigate(ferramenta)}
                ehFavorito={true}
                onToggleFavorito={alternarFavorito}
                t={t}
                mini
              />
            ))}
          </div>
          <div className="mt-6 border-t border-brand-100 dark:border-brand-900" />
        </div>
      )}

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
            onClick={() => setTagAtiva((atual) => (atual === tag ? null : tag))}
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

      {/* Grade de ferramentas */}
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
          {ferramentasFiltradas.map((ferramenta) => (
            <ToolCard
              key={ferramenta.id}
              ferramenta={ferramenta}
              onClick={() => handleNavigate(ferramenta)}
              ehFavorito={ehFavorito(ferramenta.id)}
              onToggleFavorito={alternarFavorito}
              t={t}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
