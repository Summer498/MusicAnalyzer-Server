module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
  },
  moduleNameMapper: {
    // モックする必要がある非JSモジュールのマッピング
  },
  transformIgnorePatterns: [
    // トランスフォームから除外するnode_modules内のファイル
  ],
  // その他の設定...
};