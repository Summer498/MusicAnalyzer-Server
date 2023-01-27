import { ISongleWidgetAPI } from "./ISongleWidgetAPI";
import { ISongleWidget } from "./ISongleWidget/ISongleWidget.js";
import { ICreatedSongleWidget } from "./ICreatedSongleWidget.js";

interface SongleWidgetWindow extends Window {
    SongleWidgetAPI: ISongleWidgetAPI,
    onSongleWidgetCreate: (apiKey: string, songleWidget: ICreatedSongleWidget) => void,
    onSongleWidgetError: (apiKey: string, songleWidget: ISongleWidget) => void,
    onSongleWidgetReady: (apiKey: string, songleWidget: ISongleWidget) => void,
    onSongleWidgetReload: (apiKey: string, songleWidget: ISongleWidget) => void,
    onSongleWidgetRemove: (apiKey: string, songleWidget: ISongleWidget) => void,
}

// TODO: dataset.api 以降の実装 (https://widget.songle.jp/docs/v1#onSongleWidgetCreate)
declare const globalThis: SongleWidgetWindow;
if (globalThis.SongleWidgetAPI === undefined) { throw ReferenceError('Songle Widget API を HTML からインポートする必要があります. HTML ファイル内に, "<script src="https://widget.songle.jp/v1/api.js"></script>" と記述してください.'); }
export const SongleWidgetAPI = globalThis.SongleWidgetAPI;  // eslint-disable-line no-undef

export const songle_widget_window = globalThis;
