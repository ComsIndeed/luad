import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase_auth: ["firebase/auth"],
          firebase_firestore: ["firebase/firestore"],
          firebase_storage: ["firebase/storage"],
        },
      },
    },
  },
});
