import { OctaveCount } from "@music-analyzer/view-parameters";
import { OctaveBlackBG } from "./black-bg";
import { OctaveWhiteBG } from "./white-bg";
import { WindowReflectable } from "@music-analyzer/view";

export class OctaveBG implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly white_BGs: OctaveWhiteBG;
  readonly black_BGs: OctaveBlackBG;
  readonly oct: number;
  constructor(oct: number) {
    this.oct = oct;
    this.white_BGs = new OctaveWhiteBG(oct);
    this.black_BGs = new OctaveBlackBG(oct);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-BG-${oct}`;
    this.svg.appendChild(this.white_BGs.svg);
    this.svg.appendChild(this.black_BGs.svg);
  }
  onWindowResized() {
    this.white_BGs.onWindowResized();
    this.black_BGs.onWindowResized();
  }
}

export class OctaveBGs implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: OctaveBG[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BGs";
    const octave_seed = [...Array(OctaveCount.value)];
    this.children = octave_seed.map((_, oct) => new OctaveBG(oct));
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}

