import { WindowReflectable } from "@music-analyzer/view";
import { BlackBGsPrm, BlackPosition, octave_height, PianoRollWidth } from "@music-analyzer/view-parameters";

export class BlackBG_SVG 
  implements WindowReflectable{
  readonly svg: SVGRectElement;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(
    readonly oct: number,
    black_index: number
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-BG";
    this.svg.style.fill = BlackBGsPrm.fill;
    this.svg.style.stroke = BlackBGsPrm.stroke;
    this.y = octave_height * oct + BlackBGsPrm.height * BlackPosition.get()[black_index];
    this.width = BlackBGsPrm.width;
    this.height = BlackBGsPrm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(this.y));
    this.svg.setAttribute("width", String(PianoRollWidth.get()));
    this.svg.setAttribute("height", String(this.height));
  }
}
