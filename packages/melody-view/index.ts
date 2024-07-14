import { HTML, SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgCollection, Updatable, UpdatableRegistry } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, PianoRollTimeLength, black_key_prm, piano_roll_begin, reservation_range, size } from "@music-analyzer/view-parameters";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { play } from "@music-analyzer/synth";

const ir_analysis_em = size;
const triangle_width = 5;
const triangle_height = 5;

interface Controller {
  body: HTMLSpanElement;
}

class DMelodySwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = HTML.input_checkbox({ id: "d_melody_switcher", name: "d_melody_switcher" });
    this.checkbox.checked = false;
    this.checkbox.addEventListener("change", e => {
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, "detected melody before fix"),
      this.checkbox,
    ]);
  }
}

class HierarchyLevel implements Controller {
  body: HTMLSpanElement;
  range: HTMLInputElement;
  #display: HTMLSpanElement;
  constructor() {
    this.range = HTML.input_range({ id: "hierarchy_level_slider", name: "hierarchy_level_slider", min: 0, max: 1, step: 1 });
    this.#display = HTML.span({}, `layer: ${this.range.value}`);
    this.range.addEventListener("input", e => {
      this.#display.textContent = `layer: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.range.id }, "Melody Hierarchy Level"),
      this.range,
      this.#display,
    ]);
  }
  setHierarchyLevelSliderValues = (max: number) => {
    console.log(`max: ${max}`);
    this.range.max = String(max);
    this.range.value = String(max);
    this.#display.textContent = `layer: ${this.range.value}`;
  };
};

class TimeRangeSlider implements Controller {
  body: HTMLSpanElement;
  constructor() {
    const time_range_slider = HTML.input_range({ id: "time_range_slider", name: "time_range_slider", min: 1, max: 10, step: 0.1 });
    const show_time_range_slider_value = HTML.span({}, `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`);
    time_range_slider.addEventListener("input", e => {
      show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
      PianoRollTimeLength.setRatio(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)));
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: time_range_slider.id }, "Time Range"),
      time_range_slider,
      show_time_range_slider_value,
    ]);
  }
}

class KeyGravitySwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = HTML.input_checkbox({ id: "key_gravity_switcher", name: "key_gravity_switcher" });
    this.checkbox.checked = true;
    this.checkbox.addEventListener("change", e => {
      key_gravities.forEach(key_gravity => key_gravity.setAttribute("visibility", this.checkbox.checked ? "visible" : "hidden"));
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, "Key Gravity"),
      this.checkbox,
    ]);
  };
}

class ChordGravitySwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = HTML.input_checkbox({ id: "chord_gravity_switcher", name: "chord_gravity_switcher" });
    this.checkbox.checked = true;
    this.checkbox.addEventListener("change", e => {
      chord_gravities.forEach(chord_gravity => chord_gravity.setAttribute("visibility", this.checkbox.checked ? "visible" : "hidden"));
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, "Chord Gravity"),
      this.checkbox,
    ]);
  }
}

class MelodyBeepSwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = HTML.input_checkbox({ id: "melody_beep_switcher", name: "melody_beep_switcher" });
    this.checkbox.checked = false;
    this.checkbox.addEventListener("change", e => {
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, "Beep Melody"),
      this.checkbox,
    ]);
  }
};

class MelodyBeepVolume implements Controller {
  body: HTMLSpanElement;
  range: HTMLInputElement;
  constructor() {
    this.range = HTML.input_range({ id: "melody_beep_volume", min: 0, max: 100, step: 1 });
    const show_melody_beep_volume = HTML.span({}, `volume: ${this.range.value}`);
    this.range.addEventListener("input", e => {
      show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      this.range,
      show_melody_beep_volume,
    ]);
  };
}

class MelodyColorSelector implements Controller {
  body: HTMLSpanElement;
  constructor() {
    const key_color_selector = HTML.input_radio({ name: "key_color_selector", id: "key_color_selector", value: "key", checked: `${true}` }, "key based color");
    const chord_color_selector = HTML.input_radio({ name: "chord_color_selector", id: "chord_color_selector", value: "chord" }, "chord based color");
    this.body = HTML.span({ id: "melody_color_selector" }, "", [
      HTML.label({ for: key_color_selector.id }, "key based color"),
      key_color_selector,
      HTML.label({ for: chord_color_selector.id }, "chord based color"),
      chord_color_selector,
    ]);
  }
}

const d_melody_switcher = new DMelodySwitcher();
export const hierarchy_level = new HierarchyLevel();
const time_range_slider = new TimeRangeSlider();
const key_gravity_switcher = new KeyGravitySwitcher();
const chord_gravity_switcher = new ChordGravitySwitcher();
const melody_beep_switcher = new MelodyBeepSwitcher();
const melody_beep_volume = new MelodyBeepVolume();
const melody_color_selector = new MelodyColorSelector();

export const controllers = HTML.div(
  { id: "controllers", style: "margin-top:20px" },
  "",
  [
    HTML.div({ id: "d-melody" }, "", [
      d_melody_switcher.body,
    ]),
    HTML.div({ id: "hierarchy-level" }, "", [
      hierarchy_level.body
    ]),
    HTML.div({ id: "time-length" }, "", [
      time_range_slider.body
    ]),
    HTML.div({ id: "gravity-switcher" }, "", [
      key_gravity_switcher.body,
      chord_gravity_switcher.body,
    ]),
    HTML.div({ id: "melody-beep-controllers" }, "", [
      melody_beep_switcher.body,
      melody_beep_volume.body
    ]),
    // NOTE: 色選択は未実装なので消しておく
    HTML.div({ display: "inline" }, "",
      melody_color_selector.body,
    )
  ]
);





// Melody 本体

const insertMelody = () => {
  console.log("insertMelody called");
};

const deleteMelody = () => {
  console.log("deleteMelody called");
};

class DMelodySVG implements Updatable {
  svg: SVGRectElement;
  begin: number;
  end: number;
  note: number;
  y: number;
  w: number;
  h: number;
  constructor(d_melody: TimeAndMelodyAnalysis) {
    this.svg = SVG.rect({
      name: "melody-note",
      fill: rgbToString(hsv2rgb(0, 0, 0.75)),
      stroke: "#444"
    });
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.note = d_melody.note;
    this.y = (piano_roll_begin - d_melody.note) * black_key_prm.height;
    this.w = d_melody.end - d_melody.begin;
    this.h = black_key_prm.height;
  }
  onUpdate() {
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value,
      y: this.y,
      width: this.w * NoteSize.value,
      height: this.h,
      visibility: d_melody_switcher.checkbox.checked ? "visible" : "hidden"
    });
    this.svg.onclick = insertMelody;
  }
}

export const getDMelodySVGs = (detected_melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "detected-melody",
  detected_melodies.map(e => new DMelodySVG(e))
);

class MelodySVG implements Updatable {
  svg: SVGRectElement;
  begin: number;
  end: number;
  note: number;
  layer: number;
  y: number;
  w: number;
  h: number;
  sound_reserved: boolean;

  constructor(melody: TimeAndMelodyAnalysis, layer?: number) {
    this.svg = SVG.rect({
      name: "melody-note",
      fill: fifthChromaToColor(melody.note, 0.75, 0.9),
      stroke: "#444"
    });
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.layer = layer || 0;
    this.y = (piano_roll_begin - melody.note) * black_key_prm.height;
    this.w = (melody.end - melody.begin) * 15 / 16;  // 最初と最後がくっつくのを防ぐために少し短くする
    this.h = black_key_prm.height;
    this.sound_reserved = false;
  }

  beepMelody = (volume: number) => {
    const now_at = NowAt.value;
    if (now_at <= this.begin && this.begin < now_at + reservation_range) {
      if (this.sound_reserved === false) {
        play([440 * Math.pow(2, (this.note - 69) / 12)], this.begin - now_at, this.end - this.begin, volume);
        this.sound_reserved = true;
        setTimeout(() => { this.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  };

  onUpdate() {
    const is_visible = hierarchy_level.range.value === String(this.layer);
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value,
      y: this.y,
      width: this.w * NoteSize.value,
      height: this.h,
      onclick: "MusicAnalyzer.deleteMelody()",
      visibility: is_visible ? "visible" : "hidden"
    });
    if (melody_beep_switcher.checkbox.checked && is_visible) {
      this.beepMelody(Number(melody_beep_volume.range.value) / 400);
    }
  }
}

export const getHierarchicalMelodySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new MelodySVG(e, l))
    )
  );

class IRSymbolSVG implements Updatable {
  svg: SVGTextElement;
  begin: number;
  end: number;
  archetype: Archetype;
  layer: number;
  y: number;
  constructor(melody: TimeAndMelodyAnalysis, layer?: number) {
    this.svg = SVG.text(
      {
        id: "I-R Symbol",
        "font-family": 'Times New Roman',
        "font-size": `${ir_analysis_em}em`,
        "text-anchor": "middle",
      },
      melody.melody_analysis.implication_realization.symbol,
    );
    this.begin = melody.begin;
    this.end = melody.end;
    this.archetype = melody.melody_analysis.implication_realization;
    this.layer = layer || 0;
    this.y = (piano_roll_begin - melody.note) * black_key_prm.height;
  }
  onUpdate() {
    const is_visible = hierarchy_level.range.value === String(this.layer);
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.end - NowAt.value) * NoteSize.value,
      y: this.y,
      fill: get_color_of_Narmour_concept(this.archetype) || "#000",
      visibility: is_visible ? "visible" : "hidden"
    });
  };
}

export const getHierarchicalIRSymbolSVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new IRSymbolSVG(e, l))
    )
  );

type Vector2D = {
  readonly x: number;
  readonly y: number;
}
class ArrowSVG implements Updatable {
  svg: SVGGElement;
  begin: number;
  end: number;
  note: number;
  destination?: number;
  layer: number;
  src: Vector2D;
  dst: Vector2D;
  constructor(melody: TimeAndMelodyAnalysis, next: TimeAndMelodyAnalysis, gravity: Gravity, fill: string, stroke: string, layer?: number) {
    const triangle = SVG.polygon({
      name: "gravity-arrow",
      class: "triangle",
      stroke,
      "stroke-width": 5,
      fill,
    });
    const line = SVG.line({
      name: "gravity-arrow",
      class: "line",
      stroke,
      "stroke-width": 5
    });

    this.svg = SVG.g(
      { name: "gravity" }, "", [
      triangle,
      line
    ]);
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
    this.src = {
      x: (melody.end - melody.begin) / 2 + melody.begin,
      y: (piano_roll_begin + 0.5 - melody.note) * black_key_prm.height
    };
    this.dst = {
      x: next.begin,
      y: (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height
    };
  }
  onUpdate() {
    const std_pos = NowAt.value * NoteSize.value;
    const src: Vector2D = {
      x: this.src.x * NoteSize.value - std_pos + CurrentTimeX.value,
      y: this.src.y
    };
    const dst: Vector2D = {
      x: this.dst.x * NoteSize.value - std_pos + CurrentTimeX.value,
      y: this.dst.y
    };

    const dx = dst.x - src.x;
    const dy = dst.y - src.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const cos = -dy / r;
    const sin = dx / r;
    const p = [
      dst.x,
      dst.y,
      dst.x + cos * triangle_width - sin * triangle_height,
      dst.y + sin * triangle_width + cos * triangle_height,
      dst.x + cos * -triangle_width - sin * triangle_height,
      dst.y + sin * -triangle_width + cos * triangle_height
    ];
    const is_visible = hierarchy_level.range.value === String(this.layer);
    this.svg.setAttribute("visibility", is_visible ? "visible" : "hidden");
    for (const e of this.svg.getElementsByClassName("triangle")) {
      e.setAttributes({
        points: `${p.join(",")}`,
      });
    }
    for (const e of this.svg.getElementsByClassName("line")) {
      e.setAttributes({
        x1: src.x, x2: dst.x, y1: src.y, y2: dst.y,
      });
    }
  }
}

/*
class GravitySVG implements Updatable {
  readonly arrow_svg: ArrowSVG;
}
*/

// TODO: chord gravities と key gravities を別オブジェクトとして得られるようにする
const key_gravities: SVGElement[] = [];
const chord_gravities: SVGElement[] = [];

export const getChordGravitySVG = (melody: TimeAndMelodyAnalysis, i: number, melodies: TimeAndMelodyAnalysis[], layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const chord_gravity = melody.melody_analysis.chord_gravity;
  if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, chord_gravity, fill, stroke, layer);
    res.push(svg);
    chord_gravities.push(svg.svg);
  }
  return res;
};

export const getHierarchicalChordGravitySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getChordGravitySVG(e, i, a, l)).flat(2)
    )
  );

export const getScaleGravitySVG = (melody: TimeAndMelodyAnalysis, i: number, melodies: TimeAndMelodyAnalysis[], layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const scale_gravity = melody.melody_analysis.scale_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, scale_gravity, fill, stroke, layer);
    res.push(svg);
    key_gravities.push(svg.svg);
  }
  return res;
};

export const getHierarchicalScaleGravitySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getScaleGravitySVG(e, i, a, l)).flat(2)
    )
  );

class TSR_SVG implements Updatable {
  svg: SVGGElement;
  bracket: SVGPathElement;
  circle: SVGCircleElement;
  begin: number;
  end: number;
  head: { begin: number, end: number, w: number };
  layer: number;
  y: number;
  w: number;
  h: number;
  constructor(melody: TimeAndMelodyAnalysis, layer: number) {
    this.bracket = SVG.path({
      name: "group",
      stroke: "#004",
      "stroke-width": 3,
      fill: "#eee",
    });
    this.circle = SVG.circle({
      name: "head",
      stroke: "#c00",
      fill: "#c00",
    });
    this.svg = SVG.g(
      { name: "time-span-node" },
      undefined, [
      this.bracket,
      this.circle
    ]);
    this.begin = melody.begin;
    this.end = melody.end;
    this.layer = layer;
    this.y = (2 + layer) * black_key_prm.height;
    this.w = melody.end - melody.begin;
    this.h = black_key_prm.height;
    this.head = {
      ...melody.head,
      w: melody.head.end - melody.head.begin
    };
  }
  onUpdate() {
    const now_at = NowAt.value;
    const is_visible = this.layer <= Number(hierarchy_level.range.value);
    const is_just_layer = String(this.layer) === hierarchy_level.range.value;
    const x = CurrentTimeX.value + (this.begin - now_at) * NoteSize.value;
    const y = this.y;
    const w = this.w * NoteSize.value;
    const h = this.h;
    const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
    const ct11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
    const ct12 = { x: x + w * 0 / 10 + h * 1 / 2, y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + h * 2 / 2, y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - h * 2 / 2, y: y - h * 10 / 10 };
    const ct21 = { x: x + w * 10 / 10 - h * 1 / 2, y: y - h * 10 / 10 };
    const ct22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    this.bracket.setAttributes({
      d: `M${begin.x} ${begin.y}C${ct11.x} ${ct11.y} ${ct12.x} ${ct12.y} ${corner1.x} ${corner1.y}L${corner2.x} ${corner2.y}C${ct21.x} ${ct21.y} ${ct22.x} ${ct22.y} ${end.x} ${end.y}`,
      visibility: is_visible ? "visible" : "hidden",
      "stroke-width": is_just_layer ? 3 : 1,
    });
    const cw = this.head.w * NoteSize.value;
    const cx = CurrentTimeX.value + (this.head.begin - now_at) * NoteSize.value + cw / 2;
    const cy = this.y - h;
    this.circle.setAttributes({
      cx,
      cy,
      r: is_just_layer ? 5 : 3,
      visibility: is_visible ? "visible" : "hidden"
    });
  }
}

export const getTSR_SVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((e, l) => new SvgCollection(
    `layer-${l}`,
    e.map(e => new TSR_SVG(e, l))
  ));