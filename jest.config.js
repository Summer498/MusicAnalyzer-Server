module.exports = {
  preset: 'ts-jest',
  // Use jsdom so DOM APIs are available in tests that manipulate HTML
  testEnvironment: 'jsdom',
  transform: {
  },
  moduleNameMapper: {
    // モックする必要がある非JSモジュールのマッピング
  },
  transformIgnorePatterns: [
    // トランスフォームから除外するnode_modules内のファイル
  ],
  // その他の設定...
  setupFilesAfterEnv: ["./jest-preload.js"],
};
