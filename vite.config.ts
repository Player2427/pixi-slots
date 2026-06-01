import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base must match the repo name so assets resolve under
// https://<user>.github.io/pixi-slots/
export default defineConfig({
  base: '/pixi-slots/',
  plugins: [react()],
});
