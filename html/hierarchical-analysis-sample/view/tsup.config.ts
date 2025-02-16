import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],  // 必要に応じて変更
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  // そのほか必要なオプションを記述
});