# Math Hub

Portal de micro-ferramentas matemáticas utilitárias — uma central onde cada
ferramenta resolve um problema específico com uma interface simples e consistente.

## ✨ Ferramentas disponíveis

- 🧮 **Calculadora Científica (LISP)** — avalia expressões com números
  complexos e exibe a notação prefixa (LISP) equivalente.
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
- 🔢 **Operações com Matrizes** — soma, subtração, multiplicação,
  transposta e determinante de matrizes 2×2 e 3×3.
- 📐 **Conversor de Unidades** — converte entre unidades de comprimento,
  massa, temperatura e volume em tempo real.

## 🛠️ Stack técnica

- **[React](https://react.dev/)** (via **[Vite](https://vitejs.dev/)**)
- **[Tailwind CSS](https://tailwindcss.com/)** para estilização
- **[React Router](https://reactrouter.com/)** para navegação por URL
- **[i18next](https://www.i18next.com/)** / `react-i18next` para tradução
- **[Vitest](https://vitest.dev/)** para testes automatizados (117 testes)
- Dados das ferramentas servidos por um arquivo JSON local (sem backend)
- Deploy contínuo via **[Vercel](https://vercel.com/)**

## 📁 Estrutura do projeto

```
src/
├── assets/                  # imagens, logo, ícones
├── components/
│   ├── ui/                   # componentes reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── ToolCard.jsx
│   │   ├── OutputPanel.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Logo.jsx           # SVG inline — sem flash ao trocar tema
│   │   ├── ThemeToggle.jsx
│   │   └── LangToggle.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── features/                # cada ferramenta vive isolada aqui
│   ├── lisp-calculator/
│   ├── matrix-circuit/
│   ├── interest-calculator/
│   ├── descriptive-stats/
│   ├── currency-converter/
│   ├── base-converter/
│   ├── matrix-ops/
│   └── unit-converter/
├── pages/
│   ├── Home.jsx             # grade com busca e filtros por tag
│   └── ToolPage.jsx         # cabeçalho contextual + ferramenta
├── context/
│   └── ThemeContext.jsx
├── hooks/
│   └── useDocumentTitle.js
├── data/
│   └── projetos.json        # catálogo das ferramentas do Hub
├── locales/                 # traduções pt-BR / en / es
│   ├── pt-BR.json
│   ├── en.json
│   └── es.json
├── utils/
│   └── TranslateError.js
├── i18n.js
├── App.jsx                  # rotas + lazy loading por ferramenta
└── main.jsx
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
npm test               # roda os 117 testes automatizados
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
  o Hub inteiro; distingue erros de código de erros de rede (chunk).
- **i18n por namespace** — `tools.<nome>` mantém cada ferramenta
  responsável pelo próprio conteúdo textual.
- **Cache de API com TTL** — cotações de moeda ficam no localStorage
  por 24h, economizando requisições da cota gratuita.
- **SVG inline para logo** — zero requisição de rede, sem flash ao
  trocar tema, cores controladas por classes Tailwind.
- **JSON como banco de dados temporário** — `projetos.json` pode migrar
  para uma API real sem alterar os componentes.

## 🤝 Contribuindo

Convenções de commits e branches estão documentadas em
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
