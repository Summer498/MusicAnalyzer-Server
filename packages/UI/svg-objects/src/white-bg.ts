import { WindowReflectable } from "@music-analyzer/view";
import { octave_height, PianoRollWidth, WhiteBGsPrm, WhitePosition } from "@music-analyzer/view-parameters";

export class WhiteBG_SVG 
  implements WindowReflectable {
  readonly svg: SVGRectElement;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(
    readonly oct: number,
    white_index: number
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-BG";
    this.svg.style.fill = WhiteBGsPrm.fill;
    this.svg.style.stroke = WhiteBGsPrm.stroke;

    this.y = octave_height * oct + WhiteBGsPrm.height * WhitePosition.get()[white_index];
    this.width = WhiteBGsPrm.width;
    this.height = WhiteBGsPrm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(this.y));
    this.svg.setAttribute("width", String(PianoRollWidth.get()));
    this.svg.setAttribute("height", String(this.height));
  }
}
