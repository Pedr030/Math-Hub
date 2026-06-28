/** @type {import('tailwindcss').Config} */
export default {
  // 'class' significa: o modo escuro é ativado manualmente adicionando
  // a classe "dark" na tag <html> (em vez de seguir automaticamente
  // a configuração do sistema operacional). Isso nos dá controle via
  // um botão na interface (o ThemeToggle que ainda vamos criar).
  darkMode: 'class',

  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      colors: {
        // Paleta derivada DIRETAMENTE das cores da logo (#3887C2 / #153E6C),
        // não mais um azul genérico de placeholder — a logo é a fonte
        // da verdade da identidade visual do produto.
        brand: {
          50: '#EFF6FB',
          100: '#D7E8F4',
          200: '#AFD1E9',
          300: '#7DB5DA',
          400: '#3887C2', // azul claro exato da logo
          500: '#2D71A8', // ponto médio — uso geral em botões/links
          600: '#235A87',
          700: '#1B4670',
          800: '#153E6C', // navy exato da logo (texto/contornos)
          900: '#102E50',
          950: '#0A1F38', // fundo escuro profundo
        },
        // Cinza-azulado usado nos detalhes secundários da logo
        mist: '#C9D1D5',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'], // títulos
        body: ['Inter', 'sans-serif'], // texto corrido
        mono: ['"JetBrains Mono"', 'monospace'], // expressões matemáticas/LISP, badges, dados
      },
    },
  },

  plugins: [],
};
