import { SVG } from "@music-analyzer/html";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm } from "@music-analyzer/view-parameters";
import { HierarchyLevel } from "@music-analyzer/controllers";


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