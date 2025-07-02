import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue"],
          primevue: ["primevue/config", "primevue/button", "primevue/dialog"],
          fullcalendar: ["@fullcalendar/core", "@fullcalendar/vue3"],
          amplify: ["aws-amplify", "@aws-amplify/ui-vue"],
        },
      },
    },
  },
  server: {
    port: 8080,
    open: true,
  },
});
