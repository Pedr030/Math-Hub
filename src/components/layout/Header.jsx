import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import logoLight from '../../assets/logo-light.svg';
import logoDark from '../../assets/logo-dark.svg';

// Componente de apresentação "puro": recebe o que precisa via
// componentes filhos/contexto, sem lógica de estado própria aqui —
// por isso vive em components/layout, e não em features/.
function Header() {
  // Importar um .svg no Vite retorna a URL final do arquivo (string),
  // não o conteúdo SVG em si — por isso usamos como src de uma <img>
  // normal, igual a qualquer outra imagem.
  const { tema } = useTheme();
  const logo = tema === 'dark' ? logoDark : logoLight;

  return (
    <header className="border-b border-brand-100 bg-white/80 backdrop-blur-sm dark:border-brand-900 dark:bg-brand-950/80 sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <img src={logo} alt="Math Hub" className="h-9 w-auto" />

        <div className="flex items-center gap-4">
          <nav className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            Ferramentas matemáticas
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
