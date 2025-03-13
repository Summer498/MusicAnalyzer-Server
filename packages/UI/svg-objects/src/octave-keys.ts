import { OctaveCount } from "@music-analyzer/view-parameters";
import { WindowReflectable } from "@music-analyzer/view";
import { OctaveBlackKey } from "./black-key";
import { OctaveWhiteKey } from "./white-key";

export class OctaveKey implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly white_keys: OctaveWhiteKey;
  readonly black_keys: OctaveBlackKey;
  constructor(
    readonly oct: number,
  ) {
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

export class OctaveKeys implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: OctaveKey[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-keys";
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveKey(oct));
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
