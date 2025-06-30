import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // cần import path để xử lý đường dẫn

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
