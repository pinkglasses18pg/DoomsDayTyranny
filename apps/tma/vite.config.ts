import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.svg'], // Ensure Vite handles SVG as assets
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/*",
          dest: "assets",
        },
      ],
    }),
  ],
  server: {
    port: 3005,
    /* middlewareMode: true, // Enables middleware
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Permissions-Policy', 'clipboard-write=(self)');
        next();
      });
  } */
  },
  preview: {
    port: 3005,
  },
});
