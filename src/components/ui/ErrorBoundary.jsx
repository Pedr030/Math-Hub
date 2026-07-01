import { Component } from "react";
import { useTranslation } from "react-i18next";

/**
 * Classe que captura erros de renderização nos filhos.
 * Recebe "t" e "onReset" via props — não pode usar hooks diretamente
 * por ser uma classe (única opção para getDerivedStateFromError).
 */
class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { temErro: false, mensagem: "" };
  }

  static getDerivedStateFromError(error) {
    return { temErro: true, mensagem: error?.message || "" };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

 handleRetry() {
  // Só chama onReset — a mudança de key no ToolPage força o desmonte
  // completo do ErrorBoundary e remonta tudo do zero, criando uma
  // instância nova com temErro: false por padrão.
  // Chamar setState aqui antes causava o bug: o filho tentava renderizar,
  // lançava o erro de novo, getDerivedStateFromError recapturava
  // imediatamente, e o onReset chegava tarde demais pra resolver.
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
          {this.state.mensagem && (
            <p className="font-mono text-xs text-red-600 dark:text-red-500 mb-4">
              {this.state.mensagem}
            </p>
          )}
          <button
            onClick={() => this.handleRetry()}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium
                       text-red-600 hover:bg-red-100 transition-colors
                       dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            {t("common.errorBoundary.botao")}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper funcional: captura o hook useTranslation (impossível na classe)
 * e passa "t" como prop. É o padrão correto para adicionar hooks
 * a componentes de classe em React moderno.
 */
function ErrorBoundary({ children, onReset }) {
  const { t } = useTranslation();
  return (
    <ErrorBoundaryClass t={t} onReset={onReset}>
      {children}
    </ErrorBoundaryClass>
  );
}

export default ErrorBoundary;
