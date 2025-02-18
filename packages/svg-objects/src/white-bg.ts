import { octave_height, OctaveCount, PianoRollWidth, white_bgs_prm, WhitePosition } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";

export class WhiteBG_SVG extends SvgAndParam {
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, white_index: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-BG";
    this.svg.style.fill = white_bgs_prm.fill;
    this.svg.style.stroke = white_bgs_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + white_bgs_prm.height * WhitePosition.value[white_index];
    this.width = white_bgs_prm.width;
    this.height = white_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
  }
}

type OctaveBG = {
  readonly children: WhiteBG_SVG[]
}
const getOctaveBgs = (oct: number): OctaveBG => {
  const white_key_seed = [...Array(7)];
  const ret = {
    children: white_key_seed.map((_, white_index) => new WhiteBG_SVG(oct, white_index))
  };
  console.log("getOctaveBgs");
  console.log(ret);
  return ret;
};

type OctaveBGs = {
  readonly children: OctaveBG[]
}
const getBGs = (): OctaveBGs => {
  const octave_seed = [...Array(OctaveCount.value)];
  const ret = {
    children: octave_seed.map((_, oct) => getOctaveBgs(oct))
  };
  console.log("getBGs");
  console.log(ret);
  return ret;
};

export const getWhiteBGs = () => getBGs();
