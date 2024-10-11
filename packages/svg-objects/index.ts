import { SVG } from "@music-analyzer/html";
import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollWidth, CurrentTimeX, octave_cnt, white_bgs_prm, piano_roll_height, octave_height, WhitePosition, black_bgs_prm, white_key_prm, BlackPosition, black_key_prm, PianoRollBegin } from "@music-analyzer/view-parameters";

const mod = (x: number, m: number): number => (x % m + m) % m;

abstract class SvgAndParam implements WindowReflectable {
  abstract svg: SVGElement;
  abstract onWindowResized(): void
}

class SvgAndParams<T extends SvgAndParam> implements WindowReflectable {
  svg: T[];
  constructor(svg_and_params: T[]) {
    this.svg = svg_and_params;
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.forEach(e => e.onWindowResized());
  }
}

class CurrentTimeLine implements WindowReflectable {
  svg: SVGLineElement;
  constructor() {
    this.svg = SVG.line();
    this.svg.setAttribute("name", "current_time");
    this.svg.setAttribute("stroke-width", "5");
    this.svg.setAttribute("stroke", "#000");
  WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.setAttribute("x1", `${CurrentTimeX.value}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.value}`);
    this.svg.setAttribute("y1", "0");
    this.svg.setAttribute("y2", `${piano_roll_height}`);
  }
}

export const getCurrentTimeLine = () => new CurrentTimeLine();

class WhiteBG_SVG extends SvgAndParam {
  svg: SVGRectElement;
  oct: number;
  y: number;
  width: number;
  height: number;
  constructor(oct: number, white_index: number) {
    super();
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "white-BG");
    this.svg.setAttribute("fill", white_bgs_prm.fill);
    this.svg.setAttribute("stroke", white_bgs_prm.stroke);
    this.oct = oct;
    this.y = octave_height * oct + white_bgs_prm.height * WhitePosition.value[white_index];
    this.width = white_bgs_prm.width;
    this.height = white_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.setAttribute("width", `${PianoRollWidth.value}`);
    this.svg.setAttribute("height", `${this.height}`);
  }
}

export const getWhiteBGs = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(7)].map((_, white_index) => new WhiteBG_SVG(oct, white_index))
  ).flat()
);

class BlackBG_SVG extends SvgAndParam {
  svg: SVGRectElement;
  oct: number;
  y: number;
  width: number;
  height: number;
  constructor(oct: number, black_index: number) {
    super();
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "black-BG");
    this.svg.setAttribute("fill", black_bgs_prm.fill);
    this.svg.setAttribute("stroke", black_bgs_prm.stroke);
    this.oct = oct;
    this.y = octave_height * oct + black_bgs_prm.height * BlackPosition.value[black_index];
    this.width = black_bgs_prm.width;
    this.height = black_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.setAttribute("width", `${PianoRollWidth.value}`);
    this.svg.setAttribute("height", `${this.height}`);
  }
}

export const getBlackBGs = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(5)].map((_, black_index) => new BlackBG_SVG(oct, black_index))
  ).flat()
);

class OctaveBG extends SvgAndParam {
  svg: SVGGElement;
  y: number;
  oct: number;
  height: number;
  constructor(oct: number, white_BGs: SvgAndParams<WhiteBG_SVG>, black_BGs: SvgAndParams<BlackBG_SVG>) {
    super();
    this.svg = SVG.g();
    this.svg.setAttribute("name", "octave-BG");
    this.svg.appendChildren(white_BGs.svg.filter(e => e.oct === oct).map(e => e.svg));
    this.svg.appendChildren(black_BGs.svg.filter(e => e.oct === oct).map(e => e.svg));
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.setAttribute("width", `${PianoRollWidth.value}`);
    this.svg.setAttribute("height", `${this.height}`);
  }
}

export const getOctaveBGs = (white_BGs: SvgAndParams<WhiteBG_SVG>, black_BGs: SvgAndParams<BlackBG_SVG>) => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) => new OctaveBG(oct, white_BGs, black_BGs))
);

class WhiteKeySVG extends SvgAndParam {
  svg: SVGRectElement;
  oct: number;
  y: number;
  width: number;
  height: number;
  constructor(oct: number, white_index: number) {
    super();
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "white-key");
    this.svg.setAttribute("fill", white_key_prm.fill);
    this.svg.setAttribute("stroke", white_key_prm.stroke);
    this.oct = oct;
    this.y = octave_height * oct + mod(white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][white_index] + (1 + PianoRollBegin.value) * black_key_prm.height, octave_height);
    this.width = white_key_prm.width;
    this.height = white_key_prm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.setAttribute("width", `${this.width}`);
    this.svg.setAttribute("height", `${this.height}`);
  }
}

export const getWhiteKeys = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(7)].map((_, white_index) => new WhiteKeySVG(oct, white_index))
  ).flat()
);

class BlackKeySVG extends SvgAndParam {
  svg: SVGRectElement;
  oct: number;
  y: number;
  width: number;
  height: number;
  constructor(oct: number, j: number) {
    super();
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "black-key");
    this.svg.setAttribute("fill", black_key_prm.fill);
    this.svg.setAttribute("stroke", black_key_prm.stroke);
    this.oct = oct;
    this.y = octave_height * oct + black_key_prm.height * BlackPosition.value[j];
    this.width = black_key_prm.width;
    this.height = black_key_prm.height;
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.setAttribute("width", `${this.width}`);
    this.svg.setAttribute("height", `${this.height}`);
  }
}

export const getBlackKeys = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(5)].map((_, j) => new BlackKeySVG(oct, j))
  ).flat()
);

class OctaveKeys extends SvgAndParam {
  svg: SVGGElement;
  y: number;
  oct: number;
  height: number;
  constructor(oct: number, white_key: SvgAndParams<WhiteKeySVG>, black_key: SvgAndParams<BlackKeySVG>) {
    super();
    this.svg = SVG.g();
    this.svg.setAttribute("name", "octave-key");
    this.svg.appendChildren(white_key.svg.filter(e => e.oct === oct).map(e => e.svg));
    this.svg.appendChildren(black_key.svg.filter(e => e.oct === oct).map(e => e.svg));
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.setAttribute("width", `${PianoRollWidth.value}`);
    this.svg.setAttribute("height", `${this.height}`);
  }
}

export const getOctaveKeys = (white_key: SvgAndParams<WhiteKeySVG>, black_key: SvgAndParams<BlackKeySVG>) =>
  new SvgAndParams(
    [...Array(octave_cnt)].map((_, oct) => new OctaveKeys(oct, white_key, black_key)),
  );

export class PianoRoll implements WindowReflectable {
  svg: SVGSVGElement;
  constructor() {
    this.svg = SVG.svg();
    this.svg.setAttribute("name", "piano-roll");
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.setAttribute("x", "0");
    this.svg.setAttribute("y", "0");
    this.svg.setAttribute("width", `${PianoRollWidth.value}`);
    this.svg.setAttribute("height", `${piano_roll_height + chord_text_size * 2 + chord_name_margin}`);
  }
}
