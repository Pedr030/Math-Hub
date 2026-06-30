import { useTranslation } from "react-i18next";

const IDIOMAS = [
  { codigo: "pt-BR", label: "PT" },
  { codigo: "en", label: "EN" },
  { codigo: "es", label: "ES" },
];

function LangToggle() {
  // useTranslation devolve:
  // - t: função de tradução (t('chave') → texto no idioma ativo)
  // - i18n: instância com métodos como changeLanguage
  const { i18n } = useTranslation();

  function trocarIdioma(codigo) {
    i18n.changeLanguage(codigo);
    localStorage.setItem("math-hub-lang", codigo);
  }

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {IDIOMAS.map(({ codigo, label }, idx) => (
        <span key={codigo} className="flex items-center gap-1">
          <button
            onClick={() => trocarIdioma(codigo)}
            className={`transition-colors ${
              i18n.language === codigo
                ? "font-semibold text-brand-500 dark:text-brand-300"
                : "text-slate-400 hover:text-brand-500 dark:hover:text-brand-300"
            }`}
          >
            {label}
          </button>
          {idx < IDIOMAS.length - 1 && (
            <span className="text-slate-300 dark:text-slate-600">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default LangToggle;
