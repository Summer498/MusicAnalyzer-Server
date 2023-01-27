//import TreeModel from "../../tree-model-js/types";

//*
declare let window: any;
declare let globalThis: any;
if (window.TreeModel === undefined) { throw ReferenceError('tree-model-js を HTML からインポートする必要があります. HTML ファイル内に, "<script src="../tree-model-js/dist/TreeModel-min.js"></script>" と記述してください.'); }
export const TreeModel = globalThis.TreeModel;  // eslint-disable-line no-undef
//*/
