import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";

// lazy() recebe uma função que retorna um import() dinâmico, em vez do
// import estático que tínhamos antes. Isso muda o comportamento do Vite:
// ao invés de incluir o código de CADA ferramenta no bundle principal
// (o que o navegador baixa inteiro ao abrir o site, mesmo na Home),
// cada ferramenta vira um arquivo .js separado, baixado sob demanda —
// só quando a rota daquela ferramenta é de fato acessada.
const LispCalculator = lazy(() => import("./features/lisp-calculator"));
const MatrixCircuit = lazy(() => import("./features/matrix-circuit"));

// Registro de componentes: liga o nome string do JSON ao componente React.
// Pra adicionar uma nova ferramenta no futuro, só adicionar uma linha aqui
// (seguindo o mesmo padrão lazy() acima).
const REGISTRO_COMPONENTES = {
  LispCalculator,
  MatrixCircuit,
};

// Tela exibida enquanto o chunk de uma ferramenta está sendo baixado.
// Reaproveita o mesmo estilo da tela de carregamento inicial do app,
// pra manter consistência visual.
function CarregandoFerramenta() {
  return (
    <div className="flex items-center justify-center py-20 font-mono text-brand-500">
      carregando...
    </div>
  );
}

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
  //   path="*"                        → ToolPage também, captura URLs
  //                                      inválidas e reaproveita a tela
  //                                      de "não encontrada" que já existe lá
  //
  // Suspense é quem "segura a tela" enquanto um componente lazy() está
  // sendo baixado — ele observa os filhos, e se algum ainda não estiver
  // pronto, mostra o fallback no lugar até o carregamento terminar.
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-brand-950 dark:bg-brand-950 dark:text-slate-50">
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-10">
          <Suspense fallback={<CarregandoFerramenta />}>
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
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
