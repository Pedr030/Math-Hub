# Math Hub

Portal de micro-ferramentas matemáticas utilitárias — uma central onde cada
ferramenta resolve um problema específico (álgebra, números complexos,
álgebra linear, etc.) com uma interface simples e consistente.

## ✨ Funcionalidades

- 🧮 **Calculadora Científica (LISP)** — avalia expressões com números
  complexos e exibe a notação prefixa (LISP) equivalente.
- ⚡ **Análise de Circuito Elétrico** — calcula correntes em circuitos de
  3 malhas usando inversão de matriz e a Lei de Kirchhoff.
- 🌗 Tema claro/escuro com persistência de preferência.
- 🌐 Internacionalização: Português, Inglês e Espanhol.
- 📱 Layout responsivo.

## 🛠️ Stack técnica

- **[React](https://react.dev/)** (via [Vite](https://vitejs.dev/))
- **[Tailwind CSS](https://tailwindcss.com/)** para estilização
- **[React Router](https://reactrouter.com/)** para navegação por URL
- **[i18next](https://www.i18next.com/)** / `react-i18next` para tradução
- Dados das ferramentas servidos por um arquivo JSON local (sem backend)
- Deploy contínuo via **[Vercel](https://vercel.com/)**

## 📁 Estrutura do projeto

```
src/
├── assets/              # imagens, logo, ícones
├── components/
│   ├── ui/               # componentes reutilizáveis (Button, Input, Modal...)
│   └── layout/            # Header, Footer
├── features/             # cada ferramenta do Hub vive isolada aqui
│   ├── lisp-calculator/
│   └── matrix-circuit/
├── pages/                # Home (grade) e ToolPage (ferramenta individual)
├── context/               # ThemeContext (tema claro/escuro)
├── data/
│   └── projetos.json      # catálogo das ferramentas do Hub
├── locales/               # traduções pt-BR / en / es
├── utils/                 # funções auxiliares (ex: tradução de erros)
├── i18n.js                # configuração do i18next
├── App.jsx                # rotas e registro de componentes
└── main.jsx                # ponto de entrada
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

1. Crie uma pasta em `src/features/<nome-da-ferramenta>/` com a lógica e
   o componente React (`index.js` exportando o componente).
2. Adicione uma entrada em `src/data/projetos.json` com `id`, `nome`,
   `descricao`, `rota` e `componente`.
3. Registre o componente em `src/App.jsx`, em `REGISTRO_COMPONENTES`.
4. Adicione as traduções em `src/locales/{pt-BR,en,es}.json`, sob
   `tools.<nomeDoComponente>` e `ferramentas.<id>`.

## 🤝 Contribuindo

Convenções de commits e branches estão documentadas em
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
