import { useParams, Link } from "react-router-dom";

// useParams lê os parâmetros dinâmicos da URL.
// Pra rota "/ferramentas/:slug", se a URL for
// "/ferramentas/lisp-calculator", useParams() devolve
// { slug: "lisp-calculator" }.
function ToolPage({ ferramentas, registroComponentes }) {
  const { slug } = useParams();

  const ferramenta = ferramentas.find((f) => f.id === slug);
  const Componente = ferramenta && registroComponentes[ferramenta.componente];

  if (!ferramenta || !Componente) {
    return (
      <div className="text-center py-20">
        <p className="font-mono text-brand-500 text-sm mb-2">404</p>
        <p className="font-display text-xl font-semibold mb-4">
          Ferramenta não encontrada
        </p>
        <Link
          to="/"
          className="font-mono text-sm text-brand-500 hover:underline"
        >
          ← voltar para o hub
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Link é o substituto do <a href> no react-router:
          navega sem recarregar a página (SPA de verdade). */}
      <Link
        to="/"
        className="inline-block mb-6 font-mono text-sm text-brand-500 hover:underline"
      >
        ← voltar para o hub
      </Link>
      <Componente />
    </>
  );
}

export default ToolPage;
