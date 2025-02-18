import { octave_height, OctaveCount, PianoRollWidth } from "@music-analyzer/view-parameters";
import { SvgAndParam, SvgAndParamsReflectable } from "./svg-and-param";
import { BlackKeySVG, getBlackKeys } from "./black-key";
import { getWhiteKeys, WhiteKeySVG } from "./white-key";

export class OctaveKey extends SvgAndParam {
  readonly svg: SVGGElement;
  readonly y: number;
  readonly oct: number;
  readonly height: number;
  readonly white_key: WhiteKeySVG[][];
  readonly black_key: BlackKeySVG[][];
  constructor(
    oct: number,
    white_key: WhiteKeySVG[][],
    black_key: BlackKeySVG[][]
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-key";
    console.log("white_key");
    console.log(white_key);
    console.log("black_key");
    console.log(black_key);
    this.white_key = white_key;
    this.black_key = black_key;
    white_key.forEach(
      e => e.filter(e => e.oct === oct)
        .forEach(e => this.svg.appendChild(e.svg))
    );
    black_key
      .forEach(e => {
        e.filter(e => e.oct === oct)
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
    this.white_key.forEach(e=>{
      e.forEach(e=>{
        e.onWindowResized();
      });
    });
    this.black_key.forEach(e=>{
      e.forEach(e=>{
        e.onWindowResized();
      });
    });
  }
}

const getBGs = (
  white_key: WhiteKeySVG[][],
  black_key: BlackKeySVG[][],
) => {
  const octave_seed = [...Array(OctaveCount.value)];
  const ret = octave_seed.map((_, oct) => new OctaveKey(oct, white_key, black_key));
  console.log("getBGs");
  console.log(ret);
  return ret;
};

export const getOctaveKeys = (
  white_key: WhiteKeySVG[][],
  black_key: BlackKeySVG[][],
) => {
  const ret = new SvgAndParamsReflectable(getBGs(white_key, black_key));
  console.log("getOctaveKeys");
  console.log(ret);
  return ret;
};

export class OctaveKeys {
  readonly svg: SVGGElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-keys";
    const white_keys = getWhiteKeys();
    const black_keys = getBlackKeys();
    console.log("white_keys");
    console.log(white_keys);
    console.log("black_keys");
    console.log(black_keys);
    getOctaveKeys(white_keys, black_keys).svg
      .forEach(e => this.svg.appendChild(e.svg));
  }
}
