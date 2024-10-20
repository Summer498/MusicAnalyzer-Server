import { SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { rgbToString } from "@music-analyzer/color";
import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin } from "@music-analyzer/view-parameters";
import { HierarchyLevel } from "@music-analyzer/controllers";

const triangle_width = 5;
const triangle_height = 5;

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
