import { black_key_prm, BlackPosition, octave_height, OctaveCount } from "@music-analyzer/view-parameters";
import { SvgAndParam, SvgAndParams } from "./svg-and-param";

export class BlackKeySVG extends SvgAndParam {
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, j: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-key";
    this.svg.style.fill = black_key_prm.fill;
    this.svg.style.stroke = black_key_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + black_key_prm.height * BlackPosition.value[j];
    this.width = black_key_prm.width;
    this.height = black_key_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.width);
    this.svg.style.height = String(this.height);
  }
}

const getOctaveBgs = (oct: number) => {
  const black_key_seed = Array(5);
  return black_key_seed.map((_, j) => new BlackKeySVG(oct, j));
};

const getBGs = () => {
  const octave_seed = Array(OctaveCount.value);
  return octave_seed.map((_, oct) => getOctaveBgs(oct)).flat();
};

export const getBlackKeys = () => new SvgAndParams(getBGs());
