import { SVG } from "@music-analyzer/html";
import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollWidth, CurrentTimeX, octave_cnt, white_bgs_prm, piano_roll_height, octave_height, white_position, black_bgs_prm, white_key_prm, black_position, black_key_prm, PianoRollTimeLength, } from "@music-analyzer/view-parameters";
import { Assertion } from "@music-analyzer/stdlib";
import { SongManager } from "@music-analyzer/song-manager";

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
    this.svg = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.setAttributes({ x1: CurrentTimeX.value, x2: CurrentTimeX.value, y1: 0, y2: piano_roll_height });
  }
}

const getCurrentTimeLine = () => new CurrentTimeLine();

class WhiteBG_SVG extends SvgAndParam {
  svg: SVGRectElement;
  oct: number;
  y: number;
  width: number;
  height: number;
  constructor(oct: number, white_index: number) {
    super();
    this.svg = SVG.rect({ name: "white-BG", fill: white_bgs_prm.fill, stroke: white_bgs_prm.stroke, });
    this.oct = oct;
    this.y = octave_height * oct + white_bgs_prm.height * white_position[white_index];
    this.width = white_bgs_prm.width;
    this.height = white_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: this.y, width: PianoRollWidth.value, height: this.height });
  }
}

const getWhiteBGs = () => new SvgAndParams(
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
    this.svg = SVG.rect({ name: "black-BG", fill: black_bgs_prm.fill, stroke: black_bgs_prm.stroke, });
    this.oct = oct;
    this.y = octave_height * oct + black_bgs_prm.height * black_position[black_index];
    this.width = black_bgs_prm.width;
    this.height = black_bgs_prm.height;
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: this.y, width: PianoRollWidth.value, height: this.height });
  }
}

const getBlackBGs = () => new SvgAndParams(
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
    this.svg = SVG.g({ name: "octave-BG" }, undefined, [
      white_BGs.svg.filter(e => e.oct === oct).map(e => e.svg),
      black_BGs.svg.filter(e => e.oct === oct).map(e => e.svg)
    ]);
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: this.y, width: PianoRollWidth.value, height: this.height });
  }
}

const getOctaveBGs = (white_BGs: SvgAndParams<WhiteBG_SVG>, black_BGs: SvgAndParams<BlackBG_SVG>) => new SvgAndParams(
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
    this.svg = SVG.rect({ name: "white-key", fill: white_key_prm.fill, stroke: white_key_prm.stroke, });
    this.oct = oct;
    this.y = octave_height * oct + white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][white_index];
    this.width = white_key_prm.width;
    this.height = white_key_prm.height;
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: this.y, width: this.width, height: this.height });
  }
}

const getWhiteKeys = () => new SvgAndParams(
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
    this.svg = SVG.rect({ name: "black-key", fill: black_key_prm.fill, stroke: black_key_prm.stroke, });
    this.oct = oct;
    this.y = octave_height * oct + black_key_prm.height * black_position[j];
    this.width = black_key_prm.width;
    this.height = black_key_prm.height;
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: this.y, width: this.width, height: this.height });
  }
}

const getBlackKeys = () => new SvgAndParams(
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
    this.svg = SVG.g({ name: "octave-key" }, undefined, [
      white_key.svg.filter(e => e.oct === oct).map(e => e.svg),
      black_key.svg.filter(e => e.oct === oct).map(e => e.svg)
    ]);
    this.y = octave_height * oct;
    this.height = octave_height;
    this.oct = oct;
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: this.y, width: PianoRollWidth.value, height: this.height });
  }
}

const getOctaveKeys = (white_key: SvgAndParams<WhiteKeySVG>, black_key: SvgAndParams<BlackKeySVG>) =>
  new SvgAndParams(
    [...Array(octave_cnt)].map((_, oct) => new OctaveKeys(oct, white_key, black_key)),
  );

class PianoRoll implements WindowReflectable {
  svg: SVGSVGElement;
  constructor() {
    this.svg = SVG.svg({ name: "piano-roll" }, undefined);
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.setAttributes({ x: 0, y: 0, width: PianoRollWidth.value, height: piano_roll_height + chord_text_size * 2 + chord_name_margin });
  }
}

export const getPianoRoll = (song_manager: SongManager) => {
  const analysis_data = song_manager.analysis_data;
  const piano_roll = new PianoRoll();

  new Assertion(analysis_data.hierarchical_melody.length > 0).onFailed(() => { throw new Error(`hierarchical melody length must be more than 0 but it is ${analysis_data.hierarchical_melody.length}`); });
  const melodies = analysis_data.hierarchical_melody[analysis_data.hierarchical_melody.length - 1];
  PianoRollTimeLength.setSongLength(
    Math.max(
      ...analysis_data.romans.map(e => e.end),
      ...melodies.map(e => e.end)
    ));

  piano_roll.svg.appendChildren([
    // 奥側
    SVG.g({ name: "octave-BGs" }, undefined, getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg.map(e => e.svg)),

    [
      song_manager.beat_bars,
      song_manager.chord_notes,
      song_manager.chord_names,
      song_manager.chord_romans,
      song_manager.chord_keys,
      song_manager.d_melody,
    ].map(e => e.group),
    [
      song_manager.hierarchical_melody,
      song_manager.hierarchical_IR,
      song_manager.hierarchical_arrow,
      song_manager.tsr_svg
    ].map(e => e.map(e => e.group)),
    SVG.g({ name: "octave-keys" }, undefined, getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg.map(e => e.svg)),
    getCurrentTimeLine().svg,
    // 手前側
  ]);

  return piano_roll;
};
