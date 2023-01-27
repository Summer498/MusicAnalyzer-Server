import { ISongle } from "./ISongle";
interface SongleWindow extends Window {
    Songle: ISongle;
    onSongleAPIReady: (Songle: ISongle) => void;
}
export declare const Songle: ISongle;
export declare const songle_window: SongleWindow;
export {};
