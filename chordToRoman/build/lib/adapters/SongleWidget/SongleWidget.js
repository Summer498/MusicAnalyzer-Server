"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songle_widget_window = exports.SongleWidgetAPI = void 0;
if (globalThis.SongleWidgetAPI === undefined) {
    throw ReferenceError('Songle Widget API を HTML からインポートする必要があります. HTML ファイル内に, "<script src="https://widget.songle.jp/v1/api.js"></script>" と記述してください.');
}
exports.SongleWidgetAPI = globalThis.SongleWidgetAPI; // eslint-disable-line no-undef
exports.songle_widget_window = globalThis;
//# sourceMappingURL=SongleWidget.js.map