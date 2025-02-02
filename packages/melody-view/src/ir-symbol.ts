import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SvgCollection__old, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin, size } from "@music-analyzer/view-parameters";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";

const ir_analysis_em = size;

class IRSymbolSVG implements Updatable {
  readonly svg: SVGTextElement;
  readonly begin: number;
  readonly end: number;
  readonly archetype: Archetype;
  readonly layer: number;
  readonly y: number;
  readonly hierarchy_level: HierarchyLevel;
  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, layer?: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = melody.melody_analysis.implication_realization.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily= "Times New Roman";
    this.svg.style.fontSize= `${ir_analysis_em}em`;
    this.svg.style.textAnchor= "middle";
    this.begin = melody.begin;
    this.end = melody.end;
    this.archetype = melody.melody_analysis.implication_realization;
    this.layer = layer || 0;
    this.y = melody.note === undefined ? -99 : (PianoRollBegin.value - melody.note) * black_key_prm.height;
    this.hierarchy_level = hierarchy_level;
  }
  onUpdate() {
    const is_visible = this.hierarchy_level.range.value === String(this.layer);
    this.svg.setAttribute("x", String(CurrentTimeX.value + (this.end - NowAt.value) * NoteSize.value));
    this.svg.setAttribute("y", String(this.y));
    // this.svg.style.fill = get_color_on_parametric_scale(this.archetype) || "#000";
    this.svg.style.fill = get_color_of_Narmour_concept(this.archetype) || "#000";
    //this.svg.style.fill = this.archetype.color || "#000";
    this.svg.style.visibility = is_visible ? "visible" : "hidden";
  };
}

export const getHierarchicalIRSymbolSVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection__old(
      `layer-${l}`,
      e.map(e => new IRSymbolSVG(e, hierarchy_level, l))
    )
  );
