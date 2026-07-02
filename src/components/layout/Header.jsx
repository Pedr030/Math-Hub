import ThemeToggle from "../ui/ThemeToggle";
import LangToggle from "../ui/LangToggle";
import { useTranslation } from "react-i18next";
import Logo from "../ui/Logo";

function Header() {
  const { t } = useTranslation();
  <Logo />;
  return (
    <header className="border-b border-brand-100 bg-white/80 backdrop-blur-sm dark:border-brand-900 dark:bg-brand-950/80 sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="/">
          <Logo />
        </a>

        <div className="flex items-center gap-4">
          <nav className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            {t("nav.subtitulo")}
          </nav>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
