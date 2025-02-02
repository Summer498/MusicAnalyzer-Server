import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SvgCollection__old, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, bracket_hight } from "@music-analyzer/view-parameters";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";


class TSR_SVG implements Updatable {
  readonly svg: SVGGElement;
  readonly bracket: SVGPathElement;
  readonly circle: SVGCircleElement;
  readonly ir_symbol: SVGTextElement;
  readonly archetype: Archetype;
  readonly begin: number;
  readonly end: number;
  readonly head: { begin: number, end: number, w: number };
  readonly layer: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly hierarchy_level: HierarchyLevel;
  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, layer: number) {
    this.bracket = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.bracket.id = "group";
    this.bracket.style.stroke = "#004";
    this.bracket.style.strokeWidth= String(3);
    this.bracket.style.fill = "#eee";
    this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.circle.id = "head";
    this.circle.style.stroke = "#c00";
    this.circle.style.fill = "#c00";

    this.ir_symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.ir_symbol.textContent = melody.melody_analysis.implication_realization.symbol;
    this.ir_symbol.id = "I-R Symbol";
    this.ir_symbol.style.fontFamily= "Times New Roman";
    this.ir_symbol.style.fontSize= `${bracket_hight}em`;
    this.ir_symbol.style.textAnchor= "middle";
    this.archetype = melody.melody_analysis.implication_realization;

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket);
    //    this.svg.appendChild(this.circle);
    this.svg.appendChild(this.ir_symbol);
    this.begin = melody.begin;
    this.end = melody.end;
    this.layer = layer;
    this.y = (2 + layer) * black_key_prm.height * bracket_hight;
    this.w = melody.end - melody.begin;
    this.h = black_key_prm.height * bracket_hight;
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
    const ct12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const ct21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const ct22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    this.bracket.setAttribute("d", `M${begin.x} ${begin.y}C${ct11.x} ${ct11.y} ${ct12.x} ${ct12.y} ${corner1.x} ${corner1.y}L${corner2.x} ${corner2.y}C${ct21.x} ${ct21.y} ${ct22.x} ${ct22.y} ${end.x} ${end.y}`);
    this.bracket.style.visibility = is_visible ? "visible" : "hidden";
    this.bracket.style.strokeWidth= is_just_layer ? "3" : "1";
    const cw = this.head.w * NoteSize.value;
    const cx = CurrentTimeX.value + (this.head.begin - now_at) * NoteSize.value + cw / 2;
    const cy = this.y - h;
    this.circle.style.cx = String(cx);
    this.circle.style.cy = String(cy);
    this.circle.style.r = String(is_just_layer ? 5 : 3);
    this.circle.style.visibility = is_visible ? "visible" : "hidden";
    this.ir_symbol.setAttribute("x", String(cx));
    this.ir_symbol.setAttribute("y", `${this.y}`);
    this.ir_symbol.style.fontSize= `${Math.min(w / h, bracket_hight)}em`;
//    this.ir_symbol.style.fill = this.archetype.color || "#000";
    this.ir_symbol.style.fill = get_color_of_Narmour_concept(this.archetype) || "#000";
    this.ir_symbol.style.visibility = is_visible ? "visible" : "hidden";
  }
}

export const getTSR_SVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((e, l) => new SvgCollection__old(
    `layer-${l}`,
    e.map(e => new TSR_SVG(e, hierarchy_level, l))
  ));