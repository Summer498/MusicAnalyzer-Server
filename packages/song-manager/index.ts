import { BeatInfo } from "@music-analyzer/beat-estimation";
import { getBeatBars } from "@music-analyzer/beat-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "@music-analyzer/chord-view";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getDMelodySVGs, getHierarchicalChordGravitySVGs, getHierarchicalIRSymbolSVGs, getHierarchicalMelodySVGs, getHierarchicalScaleGravitySVGs, getTSR_SVGs } from "@music-analyzer/melody-view";
import { _throw } from "@music-analyzer/stdlib";
import { SvgCollection } from "@music-analyzer/view";

type AnalysisData = {
  beat_info: BeatInfo
  romans: TimeAndRomanAnalysis[]
  hierarchical_melody: TimeAndMelodyAnalysis[][]
  // melodies: TimeAndMelodyAnalysis[]
  d_melodies: TimeAndMelodyAnalysis[]
}

const getMelody = (hierarchical_melody: TimeAndMelodyAnalysis[][]) => hierarchical_melody[hierarchical_melody.length - 1];

export class SongManager {
  #analysis_data?: AnalysisData;
  #beat_bars?: SvgCollection;
  #chord_notes?: SvgCollection;
  #chord_names?: SvgCollection;
  #chord_romans?: SvgCollection;
  #chord_keys?: SvgCollection;
  #d_melody?: SvgCollection;
  #hierarchical_melody?: SvgCollection[];
  #hierarchical_IR?: SvgCollection[];
  #hierarchical_chord_gravity?: SvgCollection[];
  #hierarchical_scale_gravity?: SvgCollection[];
  #tsr_svg?: SvgCollection[];
  get analysis_data() { return this.#analysis_data || _throw(TypeError("value is not set")); }
  get beat_bars() { return this.#beat_bars || (this.#beat_bars = getBeatBars(this.analysis_data.beat_info, getMelody(this.analysis_data.hierarchical_melody))); }
  get chord_notes() { return this.#chord_notes || (this.#chord_notes = getChordNotesSVG(this.analysis_data.romans) ); }
  get chord_names() { return this.#chord_names || (this.#chord_names = getChordNamesSVG(this.analysis_data.romans)); }
  get chord_romans() { return this.#chord_romans || (this.#chord_romans = getChordRomansSVG(this.analysis_data.romans)); }
  get chord_keys() { return this.#chord_keys || (this.#chord_keys = getChordKeysSVG(this.analysis_data.romans)); }
  get d_melody() { return this.#d_melody || (this.#d_melody = getDMelodySVGs(this.analysis_data.d_melodies)); }
  get hierarchical_melody() { return this.#hierarchical_melody || (this.#hierarchical_melody = getHierarchicalMelodySVGs(this.analysis_data.hierarchical_melody)); }
  get hierarchical_IR() { return this.#hierarchical_IR || (this.#hierarchical_IR = getHierarchicalIRSymbolSVGs(this.analysis_data.hierarchical_melody)); }
  get hierarchical_chord_gravity() { return this.#hierarchical_chord_gravity || (this.#hierarchical_chord_gravity = getHierarchicalChordGravitySVGs(this.analysis_data.hierarchical_melody)); }
  get hierarchical_scale_gravity() { return this.#hierarchical_scale_gravity || (this.#hierarchical_scale_gravity = getHierarchicalScaleGravitySVGs(this.analysis_data.hierarchical_melody)); }
  get tsr_svg() { return this.#tsr_svg || (this.#tsr_svg = getTSR_SVGs(this.analysis_data.hierarchical_melody)); }
  set analysis_data(analysis_data: AnalysisData) { this.#analysis_data === undefined ? this.#analysis_data = analysis_data : _throw(new EvalError("analysis_data has already registered")); }
  constructor() { }
}