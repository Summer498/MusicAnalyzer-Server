import { WindowReflectable } from "@music-analyzer/view";
import { OctaveHeight, PianoRollWidth, WhiteBGsPrm, WhitePosition } from "@music-analyzer/view-parameters";

export class WhiteBG_SVG implements WindowReflectable {
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, white_index: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-BG";
    this.svg.style.fill = WhiteBGsPrm.fill;
    this.svg.style.stroke = WhiteBGsPrm.stroke;
    this.oct = oct;
    this.y = OctaveHeight.value * oct + WhiteBGsPrm.height * WhitePosition.value[white_index];
    this.width = WhiteBGsPrm.width;
    this.height = WhiteBGsPrm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
  }
}

export class OctaveWhiteBG implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: WhiteBG_SVG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-bgs-${oct}`;
    const white_key_seed = [...Array(7)];
    this.children = white_key_seed.map((_, white_index) => new WhiteBG_SVG(oct, white_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
