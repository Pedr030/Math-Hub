import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  // useState cria uma "variável reativa": quando ela muda, o React
  // re-renderiza o componente automaticamente.
  // [valorAtual, funçãoParaAtualizar] = useState(valorInicial)
  const [ferramentas, setFerramentas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // useEffect executa código "depois" da renderização — é onde colocamos
  // efeitos colaterais: buscar dados, escutar eventos, etc.
  useEffect(() => {
    async function carregarFerramentas() {
      try {
        // Import dinâmico do JSON local. O Vite resolve isso em build-time.
        const dados = await import('./data/projetos.json');
        setFerramentas(dados.ferramentas);
      } catch (err) {
        setErro('Não foi possível carregar as ferramentas.');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarFerramentas();
  }, []); // array vazio = roda só uma vez, quando o componente "monta"

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

  return (
    <div className="min-h-screen bg-slate-50 text-brand-950 dark:bg-brand-950 dark:text-slate-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-mono text-xs uppercase tracking-wide text-brand-500 mb-2">
          ferramentas/
        </p>
        <h2 className="font-display text-2xl font-semibold mb-8">
          Escolha uma ferramenta
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ferramentas
            .filter((f) => f.ativo)
            .map((ferramenta) => (
              // "key" é obrigatório em listas no React: ajuda o algoritmo
              // de reconciliação a identificar cada item quando a lista muda.
              <article
                key={ferramenta.id}
                className={`rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md
                  border-brand-100 bg-white dark:border-brand-900 dark:bg-brand-900/40
                  ${ferramenta.destaque ? 'ring-1 ring-brand-300 dark:ring-brand-700' : ''}`}
              >
                <h3 className="font-display font-semibold text-lg">
                  {ferramenta.nome}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {ferramenta.descricao}
                </p>
              </article>
            ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
