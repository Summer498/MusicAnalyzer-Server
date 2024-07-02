import { HTML, SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, PianoRollTimeLength, black_key_prm, piano_roll_begin, reservation_range, size } from "@music-analyzer/view-parameters";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { play } from "@music-analyzer/synth";

const ir_analysis_em = size;
const triangle_width = 5;
const triangle_height = 5;


// ボタン (TODO: ボタンを package として抽出する)
// const slider = HTML.input({ type: "range", id: "slider" });
// const show_slider_value = HTML.span({}, slider.value);
// slider.addEventListener("input", e => { show_slider_value.textContent = slider.value; });

const key_gravity_switcher = HTML.input_checkbox({ id: "key_gravity_switcher", name: "key_gravity_switcher" });
key_gravity_switcher.checked = true;
key_gravity_switcher.addEventListener("change", e => { key_gravities.forEach(key_gravity => key_gravity.setAttribute("visibility", key_gravity_switcher.checked ? "visible" : "hidden")); });
const chord_gravity_switcher = HTML.input_checkbox({ id: "chord_gravity_switcher", name: "chord_gravity_switcher" });
chord_gravity_switcher.checked = true;
chord_gravity_switcher.addEventListener("change", e => { chord_gravities.forEach(chord_gravity => chord_gravity.setAttribute("visibility", chord_gravity_switcher.checked ? "visible" : "hidden")); });

// NOTE: 色選択は未実装なので消しておく
const key_color_selector = HTML.input_radio({ name: "key_color_selector", id: "key_color_selector", value: "key", checked: `${true}` }, "key based color");
const chord_color_selector = HTML.input_radio({ name: "chord_color_selector", id: "chord_color_selector", value: "chord" }, "chord based color");
const melody_color_selector =
  HTML.div({ display: "inline" }, "", [
    HTML.label({ for: key_color_selector.id }, "key based color"),
    key_color_selector,
    HTML.label({ for: chord_color_selector.id }, "chord based color"),
    chord_color_selector,
  ]);


const d_melody_switcher = HTML.input_checkbox({ id: "d_melody_switcher", name: "d_melody_switcher" });
d_melody_switcher.checked = false;
const melody_beep_switcher = HTML.input_checkbox({ id: "melody_beep_switcher", name: "melody_beep_switcher" });
melody_beep_switcher.checked = false;
const melody_beep_volume = HTML.input_range({ id: "melody_beep_volume", min: 0, max: 100, step: 1 });
const show_melody_beep_volume = HTML.span({}, `volume: ${melody_beep_volume.value}`);
melody_beep_volume.addEventListener("input", e => { show_melody_beep_volume.textContent = `volume: ${melody_beep_volume.value}`; });
const time_range_slider = HTML.input_range({ id: "time_range_slider", name: "time_range_slider", min: 1, max: 10, step: 1 });
const show_time_range_slider_value = HTML.span({}, `${Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100} %`);
time_range_slider.addEventListener("input", e => {
  show_time_range_slider_value.textContent = `${Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100} %`;
  PianoRollTimeLength.setRatio(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)));
});
const hierarchy_level_slider = HTML.input_range({ id: "hierarchy_level_slider", name: "hierarchy_level_slider", min: 0, max: 1, step: 1 });
const show_hierarchy_level_slider_value = HTML.span({}, `layer: ${hierarchy_level_slider.value}`);
hierarchy_level_slider.addEventListener("input", e => {
  show_hierarchy_level_slider_value.textContent = `layer: ${hierarchy_level_slider.value}`;
});
export const setHierarchyLevelSliderValues = (max: number) => {
  console.log(`max: ${max}`);
  hierarchy_level_slider.max = String(max);
  hierarchy_level_slider.value = String(max);
  show_hierarchy_level_slider_value.textContent = `layer: ${hierarchy_level_slider.value}`;
};


export const controllers = HTML.div({ id: "controllers" }, "", [
  HTML.div({ id: "d-melody" }, "", [
    HTML.span({}, "", [
      HTML.label({ for: d_melody_switcher.id }, "detected melody before fix"),
      d_melody_switcher,
    ]),
  ]),
  HTML.div({ id: "hierarchy-level" }, "", [
    HTML.span({}, "", [
      HTML.label({ for: hierarchy_level_slider.id }, "Melody Hierarchy Level"),
      hierarchy_level_slider,
      show_hierarchy_level_slider_value,
    ])
  ]),
  HTML.div({ id: "time-length" }, "", [
    HTML.span({}, "", [
      HTML.label({ for: time_range_slider.id }, "Time Range"),
      time_range_slider,
      show_time_range_slider_value,
    ])
  ]),
  HTML.div({ id: "gravity-switcher" }, "", [
    HTML.span({}, "", [
      HTML.label({ for: key_gravity_switcher.id }, "Key Gravity"),
      key_gravity_switcher,
    ]),
    HTML.span({}, "", [
      HTML.label({ for: chord_gravity_switcher.id }, "Chord Gravity"),
      chord_gravity_switcher,
    ])
  ]),
  HTML.span({}, "", [
    HTML.label({ for: melody_beep_switcher.id }, "Beep Melody"),
    melody_beep_switcher,
    melody_beep_volume,
    show_melody_beep_volume,
  ]),
  // NOTE: 色選択は未実装なので消しておく
  melody_color_selector,
]);





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
      visibility: d_melody_switcher.checked ? "visible" : "hidden"
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
    const is_visible = hierarchy_level_slider.value === String(this.layer);
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value,
      y: this.y,
      width: this.w * NoteSize.value,
      height: this.h,
      onclick: "MusicAnalyzer.deleteMelody()",
      visibility: is_visible ? "visible" : "hidden"
    });
    if (melody_beep_switcher.checked && is_visible) {
      this.beepMelody(Number(melody_beep_volume.value) / 400);
    }
  }
}

export const getMelodySVGs = (melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "melody",
  melodies.map(e => new MelodySVG(e))
);

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
    const is_visible = hierarchy_level_slider.value === String(this.layer);
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.end - NowAt.value) * NoteSize.value,
      y: this.y,
      fill: get_color_of_Narmour_concept(this.archetype) || "#000",
      visibility: is_visible ? "visible" : "hidden"
    });
  };
}

export const getIRSymbolSVGs = (melodies: TimeAndMelodyAnalysis[]) => {
  const IR_svgs = new SvgCollection(
    "I-R Symbols",
    melodies.map(e => new IRSymbolSVG(e))
  );
  /*
  console.log("IR symbols");
  console.log(IR_svgs);
  */
  return IR_svgs;
};

export const getHierarchicalIRSymbolSVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new IRSymbolSVG(e, l))
    )
  );


class ArrowSVG implements Updatable {
  svg: SVGGElement;
  begin: number;
  end: number;
  note: number;
  next: TimeAndMelodyAnalysis;
  destination?: number;
  layer: number;
  src_x0: number;
  dst_x0: number;
  src_y0: number;
  dst_y0: number;
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
    this.next = next;
    this.destination = gravity.destination;
    this.layer = layer || 0;
    this.src_x0 = (melody.end - melody.begin) / 2 + melody.begin;
    this.dst_x0 = next.begin;
    this.src_y0 = (piano_roll_begin + 0.5 - melody.note) * black_key_prm.height;
    this.dst_y0 = (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height;
  }
  onUpdate() {
    const is_visible = hierarchy_level_slider.value === String(this.layer);
    const std_pos = NowAt.value * NoteSize.value;
    const src_x = this.src_x0 * NoteSize.value - std_pos + CurrentTimeX.value;
    const dst_x = this.dst_x0 * NoteSize.value - std_pos + CurrentTimeX.value;
    const src_y = this.src_y0;
    const dst_y = this.dst_y0;

    const dx = dst_x - src_x;
    const dy = dst_y - src_y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const cos = -dy / r;
    const sin = dx / r;
    const p = [
      dst_x,
      dst_y,
      dst_x + cos * triangle_width - sin * triangle_height,
      dst_y + sin * triangle_width + cos * triangle_height,
      dst_x + cos * -triangle_width - sin * triangle_height,
      dst_y + sin * -triangle_width + cos * triangle_height
    ];
    for (const e of this.svg.getElementsByClassName("triangle")) {
      e.setAttributes({
        points: `${p.join(",")}`,
        visibility: is_visible ? "visible" : "hidden"
      });
    }
    for (const e of this.svg.getElementsByClassName("line")) {
      e.setAttributes({
        x1: src_x, x2: dst_x, y1: src_y, y2: dst_y,
        visibility: is_visible ? "visible" : "hidden"
      });
    }
  }
}

// TODO: chord gravities と key gravities を別オブジェクトとして得られるようにする
export const key_gravities: SVGElement[] = [];
export const chord_gravities: SVGElement[] = [];

const getArrowSVG = (melody: TimeAndMelodyAnalysis, i: number, melodies: TimeAndMelodyAnalysis[], layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const scale_gravity = melody.melody_analysis.scale_gravity;
  const chord_gravity = melody.melody_analysis.chord_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, scale_gravity, fill, stroke, layer);
    res.push(svg);
    key_gravities.push(svg.svg);
  }
  if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, chord_gravity, fill, stroke, layer);
    res.push(svg);
    chord_gravities.push(svg.svg);
  }
  return res;
};

export const getArrowSVGs = (melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "gravity-arrow",
  melodies.map(getArrowSVG).flat(2)
);

export const getHierarchicalArrowSVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getArrowSVG(e, i, a, l)).flat(2)
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
  r: number;
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
    this.r = 5;
  }
  onUpdate() {
    const now_at = NowAt.value;
    const is_visible = this.layer <= Number(hierarchy_level_slider.value);
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
      visibility: is_visible ? "visible" : "hidden"
    });
    const cw = this.head.w * NoteSize.value;
    const cx = CurrentTimeX.value + (this.head.begin - now_at) * NoteSize.value + cw / 2;
    const cy = this.y - h;
    this.circle.setAttributes({
      cx,
      cy,
      r: this.r,
      visibility: is_visible ? "visible" : "hidden"
    });
  }
}

export const getTSR_SVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][]) =>
  hierarchical_melodies.map((e, l) => new SvgCollection(
    `layer-${l}`,
    e.map(e => new TSR_SVG(e, l))
  ));