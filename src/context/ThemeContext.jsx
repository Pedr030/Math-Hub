import { createContext, useContext, useState, useEffect } from 'react';

// createContext cria um "canal" de dados que qualquer componente
// dentro do <ThemeProvider> pode acessar, sem precisar receber a
// informação via props manualmente em cada nível (isso se chama
// "prop drilling" — passar uma prop por 5 componentes só para o
// 6º usá-la. Context resolve isso).
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Função que decide o tema inicial: olha o que o usuário escolheu
  // da última vez (localStorage) e, se nunca escolheu, respeita a
  // preferência do sistema operacional.
  function getTemaInicial() {
    const salvo = localStorage.getItem('math-hub-theme');
    if (salvo === 'light' || salvo === 'dark') return salvo;

    const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefereDark ? 'dark' : 'light';
  }

  const [tema, setTema] = useState(getTemaInicial);

  // Este useEffect roda toda vez que "tema" mudar (note a dependência
  // [tema] no final). Ele sincroniza o estado do React com duas coisas
  // que vivem FORA do React: a classe no <html> (que o Tailwind usa
  // pra aplicar dark:) e o localStorage (pra lembrar a escolha).
  useEffect(() => {
    const root = document.documentElement; // a tag <html>

    if (tema === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('math-hub-theme', tema);
  }, [tema]);

  function alternarTema() {
    setTema((temaAtual) => (temaAtual === 'dark' ? 'light' : 'dark'));
  }

  // O "value" é o que fica disponível para qualquer componente
  // filho que chamar useTheme().
  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook customizado: em vez de todo componente ter que importar
// useContext + ThemeContext, ele só chama useTheme(). É só
// um "atalho" mais legível e reutilizável.
export function useTheme() {
  const contexto = useContext(ThemeContext);

  if (!contexto) {
    throw new Error('useTheme precisa ser usado dentro de um <ThemeProvider>');
  }

  return contexto;
}
