import { SVG } from "@music-analyzer/html";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin, size } from "@music-analyzer/view-parameters";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";

const ir_analysis_em = size;

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
    this.y = melody.note === undefined ? -99 : (PianoRollBegin.value - melody.note) * black_key_prm.height;
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
