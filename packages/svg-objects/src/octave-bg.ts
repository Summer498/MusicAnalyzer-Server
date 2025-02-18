import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { SvgAndParam, SvgAndParamsReflectable } from "./svg-and-param";
import { BlackBG_SVG, getBlackBGs } from "./black-bg";
import { getWhiteBGs, WhiteBG_SVG } from "./white-bg";

export class OctaveBG extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly height: number;
  readonly white_BGs: IOctaveBGs<WhiteBG_SVG>;
  readonly black_BGs: IOctaveBGs<BlackBG_SVG>;
  constructor(
    oct: number,
    white_BGs: IOctaveBGs<WhiteBG_SVG>,
    black_BGs: IOctaveBGs<BlackBG_SVG>,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BG";
    this.white_BGs = white_BGs;
    this.black_BGs = black_BGs;
    white_BGs.children.forEach(
      e => e.children.filter(e => e.oct === oct)
        .forEach(e => this.svg.appendChild(e.svg))
    );
    black_BGs.children.forEach(
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
    this.white_BGs.children.forEach(e => {
      e.children.forEach(e => {
        e.onWindowResized();
      });
    });
    this.black_BGs.children.forEach(e => {
      e.children.forEach(e => {
        e.onWindowResized();
      });
    });
  }
}

interface IOctaveBG<T> {
  readonly children: T[]
}
const getBGs = (
  white_BGs: IOctaveBGs<WhiteBG_SVG>,
  black_BGs: IOctaveBGs<BlackBG_SVG>,
) => {
  const octave_seed = [...Array(OctaveCount.value)];
  const ret = octave_seed.map((_, oct) => new OctaveBG(oct, white_BGs, black_BGs));
  return ret;
};


interface IOctaveBGs<T> {
  readonly children: IOctaveBG<T>[]
}
export const getOctaveBGs = (
  white_BGs: IOctaveBGs<WhiteBG_SVG>,
  black_BGs: IOctaveBGs<BlackBG_SVG>,
) => {
  const ret = new SvgAndParamsReflectable(getBGs(white_BGs, black_BGs));
  console.log("getOctaveKeys");
  console.log(ret);
  return ret;
};

export class OctaveBGs {
  readonly svg: SVGGElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BGs";
    const white_bgs = getWhiteBGs();
    const black_bgs = getBlackBGs();
    getOctaveBGs(white_bgs, black_bgs).svg
      .forEach(e => this.svg.appendChild(e.svg));
  }
}

