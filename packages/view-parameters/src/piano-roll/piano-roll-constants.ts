import { PianoRollWidth } from "./piano-roll-width";
import { RectParameters } from "../rect-parameter";

// --- ピアノロールの描画パラメータ
export const size = 2;
export const octave_height = size * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
export const white_key_prm = new RectParameters("#fff", "#000", 36, octave_height / 7);
export const black_key_prm = new RectParameters("#444", "#000", white_key_prm.width * 2 / 3, octave_height / 12);
export const white_bgs_prm = new RectParameters("#eee", "#000", PianoRollWidth.value, octave_height / 12);
export const black_bgs_prm = new RectParameters("#ccc", "#000", PianoRollWidth.value, octave_height / 12);
