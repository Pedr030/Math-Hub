import { useEffect } from "react";

const TITULO_PADRAO = "Math Hub";
const DESCRICAO_PADRAO =
  "Math Hub — central de micro-ferramentas matemáticas: calculadora científica com notação LISP, análise de circuitos elétricos e muito mais.";
const OG_DESCRICAO_PADRAO =
  "Central de micro-ferramentas matemáticas, gratuita e open-source.";

function setMetaContent(seletor, valor) {
  const el = document.querySelector(seletor);
  if (el) el.setAttribute("content", valor);
}

/**
 * Atualiza <title>, meta description e as tags OG/Twitter por ferramenta,
 * restaurando os valores padrão do Hub ao desmontar. Como o site é uma
 * SPA sem SSR, isso ajuda a indexação do Google (que executa JS), mas
 * não muda o preview de link em apps como WhatsApp/Twitter — esses
 * crawlers não executam JS e sempre veem o og:description estático do
 * index.html.
 */
export function useSEO(titulo, descricao) {
  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} — Math Hub` : TITULO_PADRAO;
    const descricaoFinal = descricao || DESCRICAO_PADRAO;

    document.title = tituloCompleto;
    setMetaContent('meta[name="description"]', descricaoFinal);
    setMetaContent('meta[property="og:title"]', titulo || TITULO_PADRAO);
    setMetaContent('meta[property="og:description"]', descricaoFinal);
    setMetaContent('meta[name="twitter:title"]', titulo || TITULO_PADRAO);
    setMetaContent('meta[name="twitter:description"]', descricaoFinal);

    return () => {
      document.title = TITULO_PADRAO;
      setMetaContent('meta[name="description"]', DESCRICAO_PADRAO);
      setMetaContent('meta[property="og:title"]', TITULO_PADRAO);
      setMetaContent('meta[property="og:description"]', OG_DESCRICAO_PADRAO);
      setMetaContent('meta[name="twitter:title"]', TITULO_PADRAO);
      setMetaContent('meta[name="twitter:description"]', OG_DESCRICAO_PADRAO);
    };
  }, [titulo, descricao]);
}
