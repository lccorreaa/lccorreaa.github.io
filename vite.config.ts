import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  plugins: [react()],
  base: repositoryName && !repositoryName.endsWith(".github.io")
    ? `/${repositoryName}/`
    : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        work: resolve(root, "work.html"),
        project01: resolve(root, "project-01.html"),
        project02: resolve(root, "project-02.html"),
      },
    },
  },
});
