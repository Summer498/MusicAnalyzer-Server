import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";
import { OctaveBlackBGs } from "./black-bg";
import { OctaveWhiteBGs } from "./white-bg";
import { WindowReflectableRegistry } from "@music-analyzer/view";

export class OctaveBG extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly height: number;
  readonly white_BGs: OctaveWhiteBGs;
  readonly black_BGs: OctaveBlackBGs;
  constructor(
    oct: number,
    white_BGs: OctaveWhiteBGs,
    black_BGs: OctaveBlackBGs,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BG";
    this.white_BGs = white_BGs;
    this.black_BGs = black_BGs;
    this.white_BGs.children.forEach(
      e => e.children.filter(e => e.oct === oct)
        .forEach(e => this.svg.appendChild(e.svg))
    );
    this.black_BGs.children.forEach(
      e => e.children.filter(e => e.oct === oct)
        .forEach(e => this.svg.appendChild(e.svg))
    );
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
    this.white_BGs.onWindowResized();
    this.black_BGs.onWindowResized();
  }
}

export class OctaveBGs {
  readonly svg: SVGGElement;
  readonly children: OctaveBG[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BGs";
    const white_bgs = new OctaveWhiteBGs();
    const black_bgs = new OctaveBlackBGs();
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveBG(oct, white_bgs, black_bgs));
    this.children.forEach(e => this.svg.appendChild(e.svg));
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}

