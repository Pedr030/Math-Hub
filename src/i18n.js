import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

// Detecta o idioma salvo pelo usuário, ou cai pra preferência do navegador,
// ou cai pro português como padrão final.
function detectarIdioma() {
  const salvo = localStorage.getItem("math-hub-lang");
  if (salvo) return salvo;

  const navLang = navigator.language || navigator.userLanguage;
  if (navLang.startsWith("pt")) return "pt-BR";
  if (navLang.startsWith("es")) return "es";
  return "en";
}

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
  },
  lng: detectarIdioma(),
  fallbackLng: "pt-BR", // se uma chave não existir no idioma ativo, usa pt-BR
  interpolation: {
    escapeValue: false, // React já escapa XSS por padrão, não precisa do i18next fazer isso
  },
});

export default i18n;
