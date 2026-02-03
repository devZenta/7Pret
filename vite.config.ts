import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
			"/doc": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
			"/ui": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	preview: {
		allowedHosts: ["7pret-production.up.railway.app"],
	},
});
