import { WindowReflectable } from "@music-analyzer/view";
import { BlackBGsPrm, BlackPosition, OctaveHeight, PianoRollWidth } from "@music-analyzer/view-parameters";

export class BlackBG_SVG implements WindowReflectable{
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, black_index: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-BG";
    this.svg.style.fill = BlackBGsPrm.fill;
    this.svg.style.stroke = BlackBGsPrm.stroke;
    this.oct = oct;
    this.y = OctaveHeight.value * oct + BlackBGsPrm.height * BlackPosition.value[black_index];
    this.width = BlackBGsPrm.width;
    this.height = BlackBGsPrm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(this.y));
    this.svg.setAttribute("width", String(PianoRollWidth.value));
    this.svg.setAttribute("height", String(this.height));
  }
}

export class OctaveBlackBG  implements WindowReflectable{
  readonly svg: SVGGElement;
  readonly children: BlackBG_SVG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-black-bgs-${oct}`;
    const black_key_seed = [...Array(5)];
    this.children = black_key_seed.map((_, black_index) => new BlackBG_SVG(oct, black_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
