import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { SvgAndParam } from "./svg-and-param";
import { OctaveBlackBG } from "./black-bg";
import { OctaveWhiteBG } from "./white-bg";
import { WindowReflectableRegistry } from "@music-analyzer/view";

export class OctaveBG extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;

  readonly height: number;
  readonly white_BGs: OctaveWhiteBG;
  readonly black_BGs: OctaveBlackBG;
  constructor(oct: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-BG-${oct}`;
    this.white_BGs = new OctaveWhiteBG(oct);
    this.black_BGs = new OctaveBlackBG(oct);
    this.svg.appendChild(this.white_BGs.svg);
    this.svg.appendChild(this.black_BGs.svg);
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
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveBG(oct));
    this.children.forEach(e => this.svg.appendChild(e.svg));
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}

