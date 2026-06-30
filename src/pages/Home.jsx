import { useNavigate } from "react-router-dom";

// useNavigate é o hook do react-router que substitui o setFerramentaAtivaId
// que tínhamos antes — em vez de mudar um estado, ele muda a URL.
// O resultado visual é o mesmo, mas agora a URL reflete o que está na tela.
function Home({ ferramentas, registroComponentes }) {
  const navigate = useNavigate();

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-2">
        ferramentas/
      </p>
      <h2 className="font-display text-2xl font-semibold mb-8">
        Escolha uma ferramenta
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
                  {ferramenta.nome}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {ferramenta.descricao}
                </p>
              </article>
            );
          })}
      </div>
    </>
  );
}

export default Home;
