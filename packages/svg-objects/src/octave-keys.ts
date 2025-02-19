import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";
import { OctaveBlackKeys } from "./black-key";
import { OctaveWhiteKeys } from "./white-key";
import { WindowReflectableRegistry } from "@music-analyzer/view";

export class OctaveKey extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly height: number;
  readonly white_key: OctaveWhiteKeys;
  readonly black_key: OctaveBlackKeys;
  constructor(
    oct: number,
    white_key: OctaveWhiteKeys,
    black_key: OctaveBlackKeys,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-key";
    this.white_key = white_key;
    this.black_key = black_key;
    this.white_key.children.forEach(
      e => e.children.filter(e => e.oct === oct)
        .forEach(e => this.svg.appendChild(e.svg))
    );
    this.black_key.children.forEach(e => {
      e.children.filter(e => e.oct === oct)
        .forEach(e => this.svg.appendChild(e.svg));
    });
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
    this.white_key.onWindowResized();
    this.black_key.onWindowResized();
  }
}

export class OctaveKeys {
  readonly svg: SVGGElement;
  readonly children: OctaveKey[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-keys";
    const white_keys = new OctaveWhiteKeys();
    const black_keys = new OctaveBlackKeys();
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveKey(oct, white_keys, black_keys));
    this.children.forEach(e => this.svg.appendChild(e.svg));
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
