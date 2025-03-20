import { AudioReflectable, AudioReflectableRegistry, WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { MusicStructureElements } from "../piano-roll";

export class AnalysisView
  implements AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: (AudioReflectable & WindowReflectable)[];
  constructor(
    analysis: MusicStructureElements,
  ) {
    const { beat, chord, melody } = analysis;
    this.children = [beat, chord, melody];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // this.svg.appendChild(beat.beat_bars.svg);
    this.svg.appendChild(chord.chord_notes.svg);
    this.svg.appendChild(chord.chord_names.svg);
    this.svg.appendChild(chord.chord_romans.svg);
    this.svg.appendChild(chord.chord_keys.svg);
    this.svg.appendChild(melody.d_melody_collection.svg);
    this.svg.appendChild(melody.melody_hierarchy.svg);
    this.svg.appendChild(melody.ir_hierarchy.svg);
    this.svg.appendChild(melody.chord_gravities.svg);
    this.svg.appendChild(melody.scale_gravities.svg);
    this.svg.appendChild(melody.time_span_tree.svg);
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}