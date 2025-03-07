import { PianoRollWidth } from "./piano-roll-width";
import { RectParameters } from "../rect-parameter";

// --- ピアノロールの描画パラメータ
export class Size {
  static readonly value = 2;
}
export class OctaveHeight {
  static readonly value = Size.value * 84;  // 7 白鍵と 12 半音をきれいに描画するには 7 * 12 の倍数が良い
}
export class WhiteKeyPrm extends RectParameters {
  static readonly fill = "rgb(255, 255, 255)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = 36;
  static readonly height = OctaveHeight.value / 7;
};
export class BlackKeyPrm extends RectParameters {
  static readonly fill = "rgb(64, 64, 64)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = WhiteKeyPrm.width * 2 / 3;
  static readonly height = OctaveHeight.value / 12;
}
export class WhiteBGsPrm extends RectParameters {
  static readonly fill = "rgb(242, 242, 242)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = PianoRollWidth.value;
  static readonly height = OctaveHeight.value / 12;
}
export class BlackBGsPrm extends RectParameters {
  static readonly fill = "rgb(192, 192, 192)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = PianoRollWidth.value;
  static readonly height = OctaveHeight.value / 12;
}
