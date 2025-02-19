import { octave_height, OctaveCount, white_key_prm } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";
import { OctaveBlackKey } from "./black-key";
import { OctaveWhiteKey } from "./white-key";
import { WindowReflectableRegistry } from "@music-analyzer/view";

export class OctaveKey extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly width: number;
  readonly height: number;
  readonly white_keys: OctaveWhiteKey;
  readonly black_keys: OctaveBlackKey;
  constructor(oct: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-key-${oct}`;
    this.white_keys = new OctaveWhiteKey(oct);
    this.black_keys = new OctaveBlackKey(oct);
    this.svg.appendChild(this.white_keys.svg);
    this.svg.appendChild(this.black_keys.svg);
    this.y = octave_height * oct;
    this.width = white_key_prm.width;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.width);
    this.svg.style.height = String(this.height);
    this.white_keys.onWindowResized();
    this.black_keys.onWindowResized();
  }
}

export class OctaveKeys {
  readonly svg: SVGGElement;
  readonly children: OctaveKey[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-keys";
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveKey(oct));
    this.children.forEach(e => this.svg.appendChild(e.svg));
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
