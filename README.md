# Math Hub

Portal de micro-ferramentas matemáticas utilitárias — uma central onde cada
ferramenta resolve um problema específico com uma interface simples e consistente.

## ✨ Ferramentas disponíveis

- 🧮 **Calculadora Científica (LISP)** — calculadora científica com dois modos:
  botões físicos para expressões reais e modo LISP para números complexos com
  notação prefixa.
- ⚡ **Análise de Circuito Elétrico** — calcula correntes em circuitos de
  3 malhas usando inversão de matriz e a Lei de Kirchhoff.
- 💰 **Calculadora de Juros** — calcula juros simples ou compostos com
  tabela de evolução período a período e taxa equivalente entre unidades.
- 📊 **Estatística Descritiva** — calcula média, mediana, moda, desvio
  padrão e outras métricas a partir de uma lista de números.
- 💱 **Conversor de Moeda** — converte valores entre as principais moedas
  do mundo com cotação atualizada diariamente via ExchangeRate-API.
- 🔢 **Conversor de Bases Numéricas** — converte entre binário, octal,
  decimal e hexadecimal com passo a passo das divisões sucessivas.
- 🔣 **Operações com Matrizes** — soma, subtração, multiplicação,
  transposta e determinante de matrizes 2×2 e 3×3.
- 📐 **Conversor de Unidades** — converte entre unidades de comprimento,
  massa, temperatura e volume com resultado em tempo real.
- 📈 **Calculadora de Progressões** — calcula termo geral, soma e sequência
  de PA e PG, com identificação automática do tipo a partir de uma sequência.

**Funcionalidades transversais:**

- ⭐ Favoritos — marque ferramentas para acesso rápido no topo da Home.
- 🌗 Tema claro/escuro com persistência de preferência.
- 🌐 Internacionalização: Português, Inglês e Espanhol.
- 🔍 Busca e filtros por tag na grade de ferramentas.
- 📱 Layout responsivo.

## 🛠️ Stack técnica

- **[React](https://react.dev/)** (via **[Vite](https://vitejs.dev/)**)
- **[Tailwind CSS](https://tailwindcss.com/)** para estilização
- **[React Router](https://reactrouter.com/)** para navegação por URL
- **[i18next](https://www.i18next.com/)** / `react-i18next` para tradução
- **[Vitest](https://vitest.dev/)** para testes automatizados
- Dados das ferramentas servidos por um arquivo JSON local (sem backend)
- Deploy contínuo via **[Vercel](https://vercel.com/)**

## 📁 Estrutura do projeto

```
src/
├── assets/                  # imagens, logo, ícones
├── components/
│   ├── ui/                   # componentes reutilizáveis
│   │   ├── Button.jsx         # botão com variantes (primary, secondary, ghost)
│   │   ├── Input.jsx          # campo de texto em font-mono
│   │   ├── Modal.jsx          # modal genérico (ajuda contextual)
│   │   ├── ToolCard.jsx       # card container padrão de cada ferramenta
│   │   ├── OutputPanel.jsx    # painel de saída em estilo terminal
│   │   ├── ErrorBoundary.jsx  # captura erros por ferramenta; distingue rede de código
│   │   ├── Logo.jsx           # SVG inline — sem flash ao trocar tema
│   │   ├── ThemeToggle.jsx    # botão de alternância de tema
│   │   └── LangToggle.jsx     # seletor de idioma (PT | EN | ES)
│   └── layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── features/                # cada ferramenta vive isolada aqui
│   ├── lisp-calculator/      # inclui normalCalc.js (modo normal) e pipeline LISP
│   ├── matrix-circuit/
│   ├── interest-calculator/
│   ├── descriptive-stats/
│   ├── currency-converter/
│   ├── base-converter/
│   ├── matrix-ops/
│   ├── unit-converter/
│   └── progression-calc/
├── pages/
│   ├── Home.jsx             # grade com busca, filtros por tag e seção de favoritos
│   └── ToolPage.jsx         # cabeçalho contextual + ferramenta + ErrorBoundary
├── context/
│   └── ThemeContext.jsx     # tema claro/escuro com persistência
├── hooks/
│   ├── useDocumentTitle.js  # atualiza <title> por ferramenta (SEO)
│   └── useFavoritos.js      # gerencia favoritos com persistência em localStorage
├── data/
│   └── projetos.json        # catálogo das ferramentas do Hub
├── locales/                 # traduções
│   ├── pt-BR.json
│   ├── en.json
│   └── es.json
├── utils/
│   └── TranslateError.js    # mapeia mensagens de erro para chaves i18n
├── i18n.js                  # configuração do i18next
├── App.jsx                  # rotas + lazy loading por ferramenta
└── main.jsx                 # ponto de entrada
```

Cada ferramenta nova segue o mesmo padrão: uma pasta isolada em
`features/`, registrada em `projetos.json` (catálogo) e em `App.jsx`
(registro de componentes), com seus próprios textos sob
`tools.<nomeDaFerramenta>` em cada arquivo de `locales/`.

## 🚀 Rodando localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

O projeto abre por padrão em `http://localhost:5173`.

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```
VITE_EXCHANGE_RATE_API_KEY=sua_chave_aqui
```

Obtenha uma chave gratuita em [exchangerate-api.com](https://www.exchangerate-api.com/).
Na Vercel, adicione em `Settings → Environment Variables`.

### Outros comandos

```bash
npm run build          # build de produção em /dist
npm run preview        # serve o build de produção localmente
npm test               # roda os testes automatizados
npm run test:coverage  # relatório de cobertura
```

## 🌱 Adicionando uma nova ferramenta

1. Crie uma pasta em `src/features/<nome-da-ferramenta>/` com a lógica pura
   e o componente React (`index.js` exportando o componente).
2. Adicione uma entrada em `src/data/projetos.json` com `id`, `nome`,
   `descricao`, `tags`, `rota` e `componente`.
3. Registre o componente via `React.lazy()` em `src/App.jsx`.
4. Adicione traduções em `src/locales/{pt-BR,en,es}.json` sob
   `tools.<nomeDoComponente>` e `ferramentas.<id>`.
5. Escreva testes para a lógica pura em `<nome>.test.js`.

## ⚙️ Decisões de arquitetura

- **Monorepo com features isoladas** — cada ferramenta pode ser extraída
  para repositório separado no futuro sem reescrever o resto do Hub.
- **Code splitting por ferramenta** — `React.lazy()` garante que cada
  feature é carregada só quando a rota é acessada.
- **Error Boundary por ferramenta** — erros de renderização não derrubam
  o Hub inteiro; distingue erros de código de erros de rede (chunk),
  com comportamento de retry diferente para cada caso.
- **i18n por namespace** — `tools.<nome>` mantém cada ferramenta
  responsável pelo próprio conteúdo textual.
- **Cache de API com TTL** — cotações de moeda ficam no localStorage
  por 24h, economizando requisições da cota gratuita.
- **SVG inline para logo** — zero requisição de rede, sem flash ao
  trocar tema, cores controladas por classes Tailwind com dark mode nativo.
- **Favoritos em localStorage** — persistência sem backend; hook
  `useFavoritos` isola a lógica e pode ser reutilizado por outras features.
- **Dual-mode na calculadora LISP** — modo normal com botões físicos
  para expressões reais, modo LISP para números complexos com notação
  prefixa; lógicas completamente independentes no mesmo componente.
- **JSON como banco de dados temporário** — `projetos.json` pode migrar
  para uma API real sem alterar os componentes.

## 🤝 Contribuindo

Convenções de commits e branches estão documentadas em
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
