/**
 * Gera public/sitemap.xml a partir de src/data/projetos.json, pra nunca
 * ficar desatualizado quando uma ferramenta nova é adicionada ao catálogo
 * (roda automaticamente antes de cada `npm run build`).
 */
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOMINIO = "https://mathhub.app";

const { ferramentas } = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/projetos.json"), "utf-8"),
);

const hoje = new Date().toISOString().split("T")[0];

const urls = [
  { loc: `${DOMINIO}/`, prioridade: "1.0" },
  ...ferramentas
    .filter((f) => f.ativo)
    .map((f) => ({ loc: `${DOMINIO}${f.rota}`, prioridade: "0.8" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, prioridade }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${hoje}</lastmod>
    <priority>${prioridade}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(__dirname, "../public/sitemap.xml"), xml);
console.log(`sitemap.xml gerado com ${urls.length} URLs.`);
