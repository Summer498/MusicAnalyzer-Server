import { black_key_prm, octave_height, OctaveCount, PianoRollBegin, white_key_prm } from "@music-analyzer/view-parameters";
import { SvgAndParam, SvgAndParams } from "./svg-and-param";
import { mod } from "@music-analyzer/math";

export class WhiteKeySVG extends SvgAndParam {
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, white_index: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-key";
    this.svg.style.fill = white_key_prm.fill;
    this.svg.style.stroke = white_key_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + mod(white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][white_index] + (1 + PianoRollBegin.value) * black_key_prm.height, octave_height);
    this.width = white_key_prm.width;
    this.height = white_key_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.width);
    this.svg.style.height = String(this.height);
  }
}

const getOctaveBGs = (oct: number) => {
  const white_seed = Array(7);
  return white_seed.map((_, white_index) => new WhiteKeySVG(oct, white_index));
};

const getBGs = () => {
  const octave_seed = Array(OctaveCount.value);
  return octave_seed.map((_, oct) => getOctaveBGs(oct)).flat();
};

export const getWhiteKeys = () => new SvgAndParams(getBGs());
