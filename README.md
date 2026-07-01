# Math Hub

Portal de micro-ferramentas matemáticas utilitárias — uma central onde cada
ferramenta resolve um problema específico (álgebra, números complexos,
álgebra linear, finanças, etc.) com uma interface simples e consistente.

## ✨ Funcionalidades

- 🧮 **Calculadora Científica (LISP)** — avalia expressões com números
  complexos e exibe a notação prefixa (LISP) equivalente.
- ⚡ **Análise de Circuito Elétrico** — calcula correntes em circuitos de
  3 malhas usando inversão de matriz e a Lei de Kirchhoff.
- 💰 **Calculadora de Juros** — calcula juros simples ou compostos com
  tabela de evolução período a período e taxa equivalente entre unidades.
- 🌗 Tema claro/escuro com persistência de preferência.
- 🌐 Internacionalização: Português, Inglês e Espanhol.
- 📱 Layout responsivo.

## 🛠️ Stack técnica

- **[React](https://react.dev/)** (via **[Vite](https://vitejs.dev/)**)
- **[Tailwind CSS](https://tailwindcss.com/)** para estilização
- **[React Router](https://reactrouter.com/)** para navegação por URL
- **[i18next](https://www.i18next.com/)** / `react-i18next` para tradução
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
│   │   ├── ErrorBoundary.jsx  # captura erros de renderização por ferramenta
│   │   ├── ThemeToggle.jsx    # botão de alternância de tema
│   │   └── LangToggle.jsx     # seletor de idioma (PT | EN | ES)
│   └── layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── features/                # cada ferramenta do Hub vive isolada aqui
│   ├── lisp-calculator/
│   ├── matrix-circuit/
│   └── interest-calculator/
├── pages/
│   ├── Home.jsx             # grade de ferramentas
│   └── ToolPage.jsx         # casca que renderiza uma ferramenta por URL
├── context/
│   └── ThemeContext.jsx     # tema claro/escuro com persistência
├── data/
│   └── projetos.json        # catálogo das ferramentas do Hub
├── locales/                 # traduções
│   ├── pt-BR.json
│   ├── en.json
│   └── es.json
├── utils/
│   └── TranslateError.js    # mapeia mensagens de erro para chaves i18n
├── i18n.js                  # configuração do i18next
├── App.jsx                  # rotas e registro de componentes (com lazy loading)
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

### Outros comandos

```bash
npm run build      # build de produção em /dist
npm run preview    # serve o build de produção localmente
```

## 🌱 Adicionando uma nova ferramenta

1. Crie uma pasta em `src/features/<nome-da-ferramenta>/` com a lógica pura
   e o componente React (`index.js` exportando o componente).
2. Adicione uma entrada em `src/data/projetos.json` com `id`, `nome`,
   `descricao`, `rota` e `componente`.
3. Registre o componente em `src/App.jsx` via `React.lazy()` em
   `REGISTRO_COMPONENTES` (garante code splitting automático).
4. Adicione as traduções em `src/locales/{pt-BR,en,es}.json`, sob
   `tools.<nomeDoComponente>` e `ferramentas.<id>`.

## ⚙️ Decisões de arquitetura

- **Monorepo com features isoladas** — cada ferramenta vive em sua própria
  pasta e pode ser extraída para um repositório separado no futuro sem
  reescrever nada do resto do Hub.
- **Code splitting por ferramenta** — cada feature é carregada sob demanda
  via `React.lazy()`, sem impactar o tempo de carregamento inicial.
- **Error Boundary por ferramenta** — erros de renderização em uma ferramenta
  não derrubam o Hub inteiro; o usuário vê uma tela de fallback com opção
  de tentar novamente.
- **i18n por namespace** — traduções organizadas sob `tools.<nome>` mantêm
  cada ferramenta responsável pelo próprio conteúdo textual.
- **JSON como banco de dados temporário** — `projetos.json` serve como
  catálogo sem necessidade de backend; a estrutura permite migrar para uma
  API real sem alterar os componentes.

## 🤝 Contribuindo

Convenções de commits e branches estão documentadas em
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
