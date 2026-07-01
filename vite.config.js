import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node", // lógica pura não precisa de DOM
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/features/**/!(*.jsx)"], // só os .js de lógica
    },
  },
});
