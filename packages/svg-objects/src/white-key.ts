import { BlackKeyPrm, OctaveHeight, PianoRollBegin, WhiteKeyPrm } from "@music-analyzer/view-parameters";
import { mod } from "@music-analyzer/math";

export class WhiteKeySVG {
  readonly svg: SVGRectElement;
  readonly oct: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  constructor(oct: number, white_index: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-key";
    this.svg.style.fill = WhiteKeyPrm.fill;
    this.svg.style.stroke = WhiteKeyPrm.stroke;
    this.oct = oct;
    this.y = OctaveHeight.value * oct + mod(WhiteKeyPrm.height * [0, 1, 2, 3, 4, 5, 6][white_index] + (1 + PianoRollBegin.value) * BlackKeyPrm.height, OctaveHeight.value);
    this.width = WhiteKeyPrm.width;
    this.height = WhiteKeyPrm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.width);
    this.svg.style.height = String(this.height);
  }
}

export class OctaveWhiteKey {
  readonly svg: SVGGElement;
  readonly children: WhiteKeySVG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-keys-${oct}`;
    const white_seed = [...Array(7)];
    this.children = white_seed.map((_, white_index) => new WhiteKeySVG(oct, white_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized(){
    this.children.forEach(e=>e.onWindowResized());
  }
}
