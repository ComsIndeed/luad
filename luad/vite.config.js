import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase chunks
          firebase_auth: ["firebase/auth"],
          firebase_firestore: ["firebase/firestore"],
          firebase_storage: ["firebase/storage"],

          // Other chunks
          third_parties: [
            "react-firebase-hooks/auth",
            "animate.css",
            "@react-oauth/google",
            "markdown-to-jsx",
            "uuid",
          ],
          custom_libs: [
            "./src/Library/customHooks",
            "./src/Library/firebase",
            "./src/Library/firebaseStorage",
            "./src/Library/firestore",
            "./src/Library/firestoreHooks",
            "./src/Library/googleDocsLibrary",
            "./src/Library/googleOauth",
          ],
        },
      },
    },
  },
});
