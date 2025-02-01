import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollWidth, CurrentTimeX, OctaveCount, white_bgs_prm, PianoRollHeight, octave_height, WhitePosition, black_bgs_prm, white_key_prm, BlackPosition, black_key_prm, PianoRollBegin } from "@music-analyzer/view-parameters";

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
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "current_time";
    this.svg.style.strokeWidth= String(5);
    this.svg.style.stroke = "#000";
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.setAttribute("x1", `${CurrentTimeX.value}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.value}`);
    this.svg.setAttribute("y1", "0");
    this.svg.setAttribute("y2", `${PianoRollHeight.value}`);
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
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-BG";
    this.svg.style.fill = white_bgs_prm.fill;
    this.svg.style.stroke = white_bgs_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + white_bgs_prm.height * WhitePosition.value[white_index];
    this.width = white_bgs_prm.width;
    this.height = white_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
  }
}

export const getWhiteBGs = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
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
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-BG";
    this.svg.style.fill = black_bgs_prm.fill;
    this.svg.style.stroke = black_bgs_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + black_bgs_prm.height * BlackPosition.value[black_index];
    this.width = black_bgs_prm.width;
    this.height = black_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(this.height);
  }
}

export const getBlackBGs = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
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

export const getOctaveBGs = (white_BGs: SvgAndParams<WhiteBG_SVG>, black_BGs: SvgAndParams<BlackBG_SVG>) => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) => new OctaveBG(oct, white_BGs, black_BGs))
);

class WhiteKeySVG extends SvgAndParam {
  svg: SVGRectElement;
  oct: number;
  y: number;
  width: number;
  height: number;
  constructor(oct: number, white_index: number) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "white-key";
    this.svg.style.fill = white_key_prm.fill;
    this.svg.style.stroke = white_key_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + mod(white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][white_index] + (1 + PianoRollBegin.value) * black_key_prm.height, octave_height);
    this.width = white_key_prm.width;
    this.height = white_key_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.width);
    this.svg.style.height = String(this.height);
  }
}

export const getWhiteKeys = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
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
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "black-key";
    this.svg.style.fill = black_key_prm.fill;
    this.svg.style.stroke = black_key_prm.stroke;
    this.oct = oct;
    this.y = octave_height * oct + black_key_prm.height * BlackPosition.value[j];
    this.width = black_key_prm.width;
    this.height = black_key_prm.height;
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.width);
    this.svg.style.height = String(this.height);
  }
}

export const getBlackKeys = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
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

export const getOctaveKeys = (white_key: SvgAndParams<WhiteKeySVG>, black_key: SvgAndParams<BlackKeySVG>) =>
  new SvgAndParams(
    [...Array(OctaveCount.value)].map((_, oct) => new OctaveKeys(oct, white_key, black_key)),
  );

export class PianoRoll implements WindowReflectable {
  svg: SVGSVGElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(0);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(PianoRollHeight.value + chord_text_size * 2 + chord_name_margin);
  }
}
