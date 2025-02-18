import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { BlackBG_SVG } from "./black-bg";
import { SvgAndParam, SvgAndParams } from "./svg-and-param";
import { WhiteBG_SVG } from "./white-bg";

export class OctaveBG extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly height: number;
  constructor(oct: number, white_BGs: SvgAndParams<WhiteBG_SVG>, black_BGs: SvgAndParams<BlackBG_SVG>) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BG";
    white_BGs.svg
      .filter(e => e.oct === oct)
      .forEach(e => this.svg.appendChild(e.svg));
    black_BGs.svg
      .filter(e => e.oct === oct)
      .map(e => this.svg.appendChild(e.svg));
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
  }
}

export const getOctaveBGs = (
  white_BGs: SvgAndParams<WhiteBG_SVG>,
  black_BGs: SvgAndParams<BlackBG_SVG>
) => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) => new OctaveBG(oct, white_BGs, black_BGs))
);
