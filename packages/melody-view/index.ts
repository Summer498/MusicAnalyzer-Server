import { SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgCollection, SvgCollection2, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin, reservation_range, size } from "@music-analyzer/view-parameters";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { DMelodySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume } from "@music-analyzer/controllers";
import { play } from "@music-analyzer/synth";

const ir_analysis_em = size;
const triangle_width = 5;
const triangle_height = 5;

const insertMelody = () => {
  console.log("insertMelody called");
};

const deleteMelody = () => {
  console.log("deleteMelody called");
};

class DMelodyModel {
  begin: number;
  end: number;
  note: number;
  constructor(d_melody: TimeAndMelodyAnalysis) {
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.note = d_melody.note;
  }
}

class DMelodyView {
  svg: SVGRectElement;
  constructor() {
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "melody-note");
    this.svg.setAttribute("fill", rgbToString(hsv2rgb(0, 0, 0.75)));
    this.svg.setAttribute("stroke", "#444");
  }
  set x(value: number) { this.svg.setAttribute("x", `${value}`); }
  set y(value: number) { this.svg.setAttribute("y", `${value}`); }
  set width(value: number) { this.svg.setAttribute("width", `${value}`); }
  set height(value: number) { this.svg.setAttribute("height", `${value}`); }
  set visibility(value: "visible" | "hidden") { this.svg.setAttribute("visibility", value); }
  set onclick(value: () => void) { this.svg.onclick = value; };
}

class DMelodyController implements Updatable {
  model: DMelodyModel;
  view: DMelodyView;
  d_melody_switcher: DMelodySwitcher;
  constructor(d_melody: TimeAndMelodyAnalysis, d_melody_switcher: DMelodySwitcher) {
    this.model = new DMelodyModel(d_melody);
    this.view = new DMelodyView();
    this.view.y = (PianoRollBegin.value - this.model.note) * black_key_prm.height;
    this.view.width = (this.model.end - this.model.begin) * NoteSize.value;
    this.view.height = black_key_prm.height;
    this.d_melody_switcher = d_melody_switcher;
    CurrentTimeX.onUpdate.push(this.updateX.bind(this));
    NowAt.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateWidth.bind(this));

    this.onUpdate();
  }
  updateX() { this.view.x = CurrentTimeX.value + (this.model.begin - NowAt.value) * NoteSize.value; }
  updateWidth() { this.view.width = (this.model.end - this.model.begin) * NoteSize.value; }
  onUpdate() {
    this.view.onclick = insertMelody;
    this.view.visibility = this.d_melody_switcher.checkbox.checked ? "visible" : "hidden";
  }
}

export const getDMelodyControllers = (detected_melodies: TimeAndMelodyAnalysis[], d_melody_switcher: DMelodySwitcher) => new SvgCollection2(
  "detected-melody",
  detected_melodies.map(e => new DMelodyController(e, d_melody_switcher))
);

class MelodyModel {
  begin: number;
  end: number;
  note: number;
  layer: number;
  constructor(melody: TimeAndMelodyAnalysis, layer: number) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.layer = layer;
  }
}

class MelodyView {
  svg: SVGRectElement;
  sound_reserved: boolean;
  constructor(color: string) {
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "melody-note");
    this.svg.setAttribute("fill", color);
    this.svg.setAttribute("stroke", "#444");
    this.sound_reserved = false;
  }
  set x(value: number) { this.svg.setAttribute("x", `${value}`); }
  set y(value: number) { this.svg.setAttribute("y", `${value}`); }
  set width(value: number) { this.svg.setAttribute("width", `${value}`); }
  set height(value: number) { this.svg.setAttribute("height", `${value}`); }
  get visibility() { 
    const visibility = this.svg.getAttribute("visibility");
    if (visibility === "visible" || visibility === "hidden"){return visibility;}
    else {throw new TypeError(`Illegal string received. Expected is "visible" or "hidden" but reserved is ${visibility}`);}
  }
  set visibility(value: "visible" | "hidden") { this.svg.setAttribute("visibility", value); }
  set onclick(value: () => void) { this.svg.onclick = value; }
}

class MelodyController implements Updatable {
  model: MelodyModel;
  view: MelodyView;
  hierarchy_level: HierarchyLevel;
  melody_beep_switcher: MelodyBeepSwitcher;
  melody_beep_volume: MelodyBeepVolume;

  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, melody_beep_switcher: MelodyBeepSwitcher, melody_beep_volume: MelodyBeepVolume, layer?: number) {
    this.model = new MelodyModel(melody, layer || 0);
    // this.view = new MelodyView(get_color_on_parametric_scale(melody.melody_analysis.implication_realization));
    this.view = new MelodyView(get_color_of_Narmour_concept(melody.melody_analysis.implication_realization));
    // this.view = new MelodyView(fifthChromaToColor(melody.note, 0.75, 0.9));
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    this.hierarchy_level = hierarchy_level;
    this.melody_beep_switcher = melody_beep_switcher;
    this.melody_beep_volume = melody_beep_volume;
    CurrentTimeX.onUpdate.push(this.updateX.bind(this));
    NowAt.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateWidth.bind(this));
    this.onUpdate();
  }
  updateX() { this.view.x = CurrentTimeX.value + (this.model.begin - NowAt.value) * NoteSize.value; }
  updateY() { this.view.y = (PianoRollBegin.value - this.model.note) * black_key_prm.height; }
  updateWidth() { this.view.width = (this.model.end - this.model.begin) * 15 / 16 * NoteSize.value; }
  updateHeight() { this.view.height = black_key_prm.height; }
  updateVisibility() {
    const is_visible = this.hierarchy_level.range.value === `${this.model.layer}`;
    this.view.visibility = is_visible ? "visible" : "hidden";
  }

  beepMelody = () => {
    const now_at = NowAt.value;

    if (now_at <= this.model.begin && this.model.begin < now_at + reservation_range) {
      console.log("this");
      console.log(this);
      console.log("this.view");
      console.log(this.view);
      if (this.view.sound_reserved === false) {
        console.log("this.view.sound_reserved === false");
        const volume = Number(this.melody_beep_volume.range.value) / 400;
        const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
        const begin_sec = this.model.begin - now_at;
        const length_sec = this.model.end - this.model.begin;
        console.log(`pitch: ${pitch}`);
        play(pitch, begin_sec, length_sec, volume);
        this.view.sound_reserved = true;
        setTimeout(() => { this.view.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  };

  onUpdate() {
    this.updateVisibility();
    this.view.onclick = deleteMelody;
    console.log(this.melody_beep_switcher.checkbox.checked);
    console.log(this.view.visibility);
    if (this.melody_beep_switcher.checkbox.checked && this.view.visibility === "visible") {
      this.beepMelody();
    }
  }
}

export const getHierarchicalMelodyControllers = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel, melody_beep_switcher: MelodyBeepSwitcher, melody_beep_volume: MelodyBeepVolume) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection2(
      `layer-${l}`,
      e.map(e => new MelodyController(e, hierarchy_level, melody_beep_switcher, melody_beep_volume, l))
    )
  );

class IRSymbolSVG implements Updatable {
  svg: SVGTextElement;
  begin: number;
  end: number;
  archetype: Archetype;
  layer: number;
  y: number;
  hierarchy_level: HierarchyLevel;
  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, layer?: number) {
    this.svg = SVG.text();
    this.svg.textContent = melody.melody_analysis.implication_realization.symbol;
    this.svg.setAttribute("id", "I-R Symbol");
    this.svg.setAttribute("font-family", "Times New Roman");
    this.svg.setAttribute("font-size", `${ir_analysis_em}em`);
    this.svg.setAttribute("text-anchor", "middle");
    this.begin = melody.begin;
    this.end = melody.end;
    this.archetype = melody.melody_analysis.implication_realization;
    this.layer = layer || 0;
    this.y = (PianoRollBegin.value - melody.note) * black_key_prm.height;
    this.hierarchy_level = hierarchy_level;
  }
  onUpdate() {
    const is_visible = this.hierarchy_level.range.value === String(this.layer);
    this.svg.setAttribute("x", `${CurrentTimeX.value + (this.end - NowAt.value) * NoteSize.value}`);
    this.svg.setAttribute("y", `${this.y}`);
    // this.svg.setAttribute("fill", get_color_on_parametric_scale(this.archetype) || "#000");
    this.svg.setAttribute("fill", get_color_of_Narmour_concept(this.archetype) || "#000");
    this.svg.setAttribute("visibility", is_visible ? "visible" : "hidden");
  };
}

export const getHierarchicalIRSymbolSVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new IRSymbolSVG(e, hierarchy_level, l))
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
  hierarchy_level: HierarchyLevel;

  constructor(melody: TimeAndMelodyAnalysis, next: TimeAndMelodyAnalysis, gravity: Gravity, fill: string, stroke: string, hierarchy_level: HierarchyLevel, layer?: number) {
    const triangle = SVG.polygon();
    triangle.setAttribute("name", "gravity-arrow");
    triangle.setAttribute("class", "triangle");
    triangle.setAttribute("stroke", stroke);
    triangle.setAttribute("stroke-width", "5");
    triangle.setAttribute("fill", fill);
    const line = SVG.line();
    line.setAttribute("name", "gravity-arrow");
    line.setAttribute("class", "line");
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", "5");

    this.svg = SVG.g();
    this.svg.setAttribute("name", "gravity");
    this.svg.appendChild(triangle);
    this.svg.appendChild(line);
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
    this.src = {
      x: (melody.end - melody.begin) / 2 + melody.begin,
      y: (PianoRollBegin.value + 0.5 - melody.note) * black_key_prm.height
    };
    this.dst = {
      x: next.begin,
      y: (PianoRollBegin.value + 0.5 - gravity.destination!) * black_key_prm.height
    };
    this.hierarchy_level = hierarchy_level;
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
    const is_visible = this.hierarchy_level.range.value === `${this.layer}`;
    this.svg.setAttribute("visibility", is_visible ? "visible" : "hidden");
    for (const e of this.svg.getElementsByClassName("triangle")) {
      e.setAttribute("points", p.join(","));
    }
    for (const e of this.svg.getElementsByClassName("line")) {
      e.setAttribute("x1", `${src.x}`);
      e.setAttribute("x2", `${dst.x}`);
      e.setAttribute("y1", `${src.y}`);
      e.setAttribute("y2", `${dst.y}`);
    }
  }
}

/*
class GravitySVG implements Updatable {
  readonly arrow_svg: ArrowSVG;
}
*/

// TODO: chord gravities と key gravities を別オブジェクトとして得られるようにする
export const key_gravities: SVGElement[] = [];
export const chord_gravities: SVGElement[] = [];

export const getChordGravitySVG = (melody: TimeAndMelodyAnalysis, i: number, melodies: TimeAndMelodyAnalysis[], hierarchy_level: HierarchyLevel, layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const chord_gravity = melody.melody_analysis.chord_gravity;
  if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, chord_gravity, fill, stroke, hierarchy_level, layer);
    res.push(svg);
    chord_gravities.push(svg.svg);
  }
  return res;
};

export const getHierarchicalChordGravitySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getChordGravitySVG(e, i, a, hierarchy_level, l)).flat(2)
    )
  );

export const getScaleGravitySVG = (melody: TimeAndMelodyAnalysis, i: number, melodies: TimeAndMelodyAnalysis[], hierarchy_level: HierarchyLevel, layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const scale_gravity = melody.melody_analysis.scale_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, scale_gravity, fill, stroke, hierarchy_level, layer);
    res.push(svg);
    key_gravities.push(svg.svg);
  }
  return res;
};

export const getHierarchicalScaleGravitySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getScaleGravitySVG(e, i, a, hierarchy_level, l)).flat(2)
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
  hierarchy_level: HierarchyLevel;
  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, layer: number) {
    this.bracket = SVG.path();
    this.bracket.setAttribute("name", "group");
    this.bracket.setAttribute("stroke", "#004");
    this.bracket.setAttribute("stroke-width", "3");
    this.bracket.setAttribute("fill", "#eee");
    this.circle = SVG.circle();
    this.circle.setAttribute("name", "head");
    this.circle.setAttribute("stroke", "#c00");
    this.circle.setAttribute("fill", "#c00");
    this.svg = SVG.g();
    this.svg.setAttribute("name", "time-span-node");
    this.svg.appendChild(this.bracket);
    this.svg.appendChild(this.circle);
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
    this.hierarchy_level = hierarchy_level;
  }
  onUpdate() {
    const now_at = NowAt.value;
    const is_visible = this.layer <= Number(this.hierarchy_level.range.value);
    const is_just_layer = String(this.layer) === this.hierarchy_level.range.value;
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
    this.bracket.setAttribute("d", `M${begin.x} ${begin.y}C${ct11.x} ${ct11.y} ${ct12.x} ${ct12.y} ${corner1.x} ${corner1.y}L${corner2.x} ${corner2.y}C${ct21.x} ${ct21.y} ${ct22.x} ${ct22.y} ${end.x} ${end.y}`);
    this.bracket.setAttribute("visibility", is_visible ? "visible" : "hidden");
    this.bracket.setAttribute("stroke-width", is_just_layer ? "3" : "1");
    const cw = this.head.w * NoteSize.value;
    const cx = CurrentTimeX.value + (this.head.begin - now_at) * NoteSize.value + cw / 2;
    const cy = this.y - h;
    this.circle.setAttribute("cx", `${cx}`);
    this.circle.setAttribute("cy", `${cy}`);
    this.circle.setAttribute("r", is_just_layer ? "5" : "3");
    this.circle.setAttribute("visibility", is_visible ? "visible" : "hidden");
  }
}

export const getTSR_SVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((e, l) => new SvgCollection(
    `layer-${l}`,
    e.map(e => new TSR_SVG(e, hierarchy_level, l))
  ));