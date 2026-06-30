import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";
import LispCalculator from "./features/lisp-calculator";
import MatrixCircuit from "./features/matrix-circuit";

// Registro de componentes: liga o nome string do JSON ao componente React.
// Pra adicionar uma nova ferramenta no futuro, só adicionar uma linha aqui.
const REGISTRO_COMPONENTES = {
  LispCalculator,
  MatrixCircuit,
};

function App() {
  const [ferramentas, setFerramentas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarFerramentas() {
      try {
        const dados = await import("./data/projetos.json");
        setFerramentas(dados.ferramentas);
      } catch (err) {
        setErro("Não foi possível carregar as ferramentas.");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarFerramentas();
  }, []);

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-brand-500 dark:bg-brand-950">
        carregando...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {erro}
      </div>
    );
  }

  // BrowserRouter envolve tudo — é ele que "escuta" a URL e
  // disponibiliza o contexto de roteamento pros componentes filhos.
  // Routes é o container das rotas; só renderiza a primeira que casar.
  // Route define o par URL → componente:
  //   path="/"                        → Home (a grade)
  //   path="/ferramentas/:slug"       → ToolPage (uma ferramenta)
  // O ":slug" é um parâmetro dinâmico — casa com qualquer valor
  // nessa posição da URL e o disponibiliza via useParams().
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-brand-950 dark:bg-brand-950 dark:text-slate-50">
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-10">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  ferramentas={ferramentas}
                  registroComponentes={REGISTRO_COMPONENTES}
                />
              }
            />
            <Route
              path="/ferramentas/:slug"
              element={
                <ToolPage
                  ferramentas={ferramentas}
                  registroComponentes={REGISTRO_COMPONENTES}
                />
              }
            />
            <Route
              path="*"
              element={
                <ToolPage
                  ferramentas={ferramentas}
                  registroComponentes={REGISTRO_COMPONENTES}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
