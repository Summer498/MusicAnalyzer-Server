import { black_key_prm, octave_height, OctaveCount, PianoRollBegin, white_key_prm } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";
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

class OctaveWhiteKey {
  readonly svg: SVGGElement;
  readonly children: WhiteKeySVG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const white_seed = [...Array(7)];
    this.children = white_seed.map((_, white_index) => new WhiteKeySVG(oct, white_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized(){
    this.children.forEach(e=>e.onWindowResized());
  }
}

export class OctaveWhiteKeys {
  readonly svg: SVGGElement;
  readonly children: OctaveWhiteKey[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveWhiteKey(oct));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized(){
    this.children.forEach(e=>e.onWindowResized());
  }
}
