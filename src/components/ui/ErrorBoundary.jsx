import { Component } from "react";
import { useTranslation } from "react-i18next";

// Detecta se o erro é de carregamento de módulo dinâmico (code splitting + rede).
// React.lazy() cacheia promises rejeitadas — remontar o componente não resolve,
// é necessário um reload completo da página.
function isChunkError(error) {
  const msg = error?.message || "";
  return (
    msg.includes("dynamically imported module") ||
    msg.includes("Failed to fetch") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Importing a module script failed")
  );
}

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { temErro: false, mensagem: "", erroDeRede: false };
  }

  static getDerivedStateFromError(error) {
    return {
      temErro: true,
      mensagem: error?.message || "",
      // Sinaliza se é erro de rede/chunk pra mudar o comportamento do botão
      erroDeRede: isChunkError(error),
    };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleRetry() {
    if (this.state.erroDeRede) {
      // Chunk error: React.lazy() não tenta de novo por conta própria —
      // um reload completo é a única forma de forçar o re-fetch do módulo.
      window.location.reload();
      return;
    }
    // Erro de código: onReset() troca o key no ToolPage, forçando
    // desmonte + remonte completo sem precisar recarregar a página.
    if (this.props.onReset) this.props.onReset();
  }

  render() {
    const { t } = this.props;

    if (this.state.temErro) {
      return (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-6
                        dark:border-red-900 dark:bg-red-950/30"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-red-400 mb-1">
            {t("common.errorBoundary.prefixo")}
          </p>
          <h3 className="font-display text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            {t("common.errorBoundary.titulo")}
          </h3>

          <p className="font-mono text-xs text-red-600 dark:text-red-500 mb-4">
            {this.state.erroDeRede
              ? t("common.errorBoundary.mensagemRede")
              : this.state.mensagem}
          </p>

          <button
            onClick={() => this.handleRetry()}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium
                       text-red-600 hover:bg-red-100 transition-colors
                       dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            {this.state.erroDeRede
              ? t("common.errorBoundary.recarregar")
              : t("common.errorBoundary.botao")}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function ErrorBoundary({ children, onReset }) {
  const { t } = useTranslation();
  return (
    <ErrorBoundaryClass t={t} onReset={onReset}>
      {children}
    </ErrorBoundaryClass>
  );
}

export default ErrorBoundary;
