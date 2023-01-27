"use strict";
//import TreeModel from "../../tree-model-js/types";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeModel = void 0;
if (window.TreeModel === undefined) {
    throw ReferenceError('tree-model-js を HTML からインポートする必要があります. HTML ファイル内に, "<script src="../tree-model-js/dist/TreeModel-min.js"></script>" と記述してください.');
}
exports.TreeModel = globalThis.TreeModel; // eslint-disable-line no-undef
//*/
//# sourceMappingURL=Tree.js.map