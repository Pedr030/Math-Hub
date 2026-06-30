import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import LangToggle from "../ui/LangToggle";
import { useTranslation } from "react-i18next";
import logoLight from "../../assets/logo-light.svg";
import logoDark from "../../assets/logo-dark.svg";

function Header() {
  const { tema } = useTheme();
  const { t } = useTranslation();
  const logo = tema === "dark" ? logoDark : logoLight;

  return (
    <header className="border-b border-brand-100 bg-white/80 backdrop-blur-sm dark:border-brand-900 dark:bg-brand-950/80 sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="/">
          <img src={logo} alt="Math Hub" className="h-9 w-auto" />
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
