import { black_bgs_prm, BlackPosition, octave_height, PianoRollWidth } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";

export class BlackBG_SVG extends SvgAndParam {
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, black_index: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-BG";
    this.svg.style.fill = black_bgs_prm.fill;
    this.svg.style.stroke = black_bgs_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + black_bgs_prm.height * BlackPosition.value[black_index];
    this.width = black_bgs_prm.width;
    this.height = black_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
  }
}

