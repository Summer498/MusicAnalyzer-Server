import { OctaveCount } from "@music-analyzer/view-parameters";
import { OctaveBlackKey } from "./black-key";
import { OctaveWhiteKey } from "./white-key";
import { WindowReflectableRegistry } from "@music-analyzer/view";

export class OctaveKey {
  readonly svg: SVGGElement;
  readonly white_keys: OctaveWhiteKey;
  readonly black_keys: OctaveBlackKey;
  readonly oct: number;
  constructor(oct: number) {
    this.oct = oct;
    this.white_keys = new OctaveWhiteKey(oct);
    this.black_keys = new OctaveBlackKey(oct);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-key-${oct}`;
    this.svg.appendChild(this.white_keys.svg);
    this.svg.appendChild(this.black_keys.svg);
  }
  onWindowResized() {
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
