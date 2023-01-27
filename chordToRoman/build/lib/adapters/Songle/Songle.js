"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songle_window = exports.Songle = void 0;
if (globalThis.Songle === undefined) {
    throw ReferenceError('Songle API を HTML からインポートする必要があります. HTML ファイル内に, "<script src="https://api.songle.jp/v2/api.js"></script>" と記述してください.');
}
exports.Songle = globalThis.Songle; // eslint-disable-line no-undef
exports.songle_window = globalThis;
//# sourceMappingURL=Songle.js.map