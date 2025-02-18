import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { BlackKeySVG } from "./black-key";
import { SvgAndParam, SvgAndParams } from "./svg-and-param";
import { WhiteKeySVG } from "./white-key";

export class OctaveKeys extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly height: number;
  constructor(oct: number, white_key: SvgAndParams<WhiteKeySVG>, black_key: SvgAndParams<BlackKeySVG>) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-key";
    white_key.svg
      .filter(e => e.oct === oct)
      .map(e => this.svg.appendChild(e.svg));
    black_key.svg
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

export const getOctaveKeys = (
  white_key: SvgAndParams<WhiteKeySVG>,
  black_key: SvgAndParams<BlackKeySVG>
) =>
  new SvgAndParams(
    [...Array(OctaveCount.value)].map((_, oct) => new OctaveKeys(oct, white_key, black_key)),
  );
