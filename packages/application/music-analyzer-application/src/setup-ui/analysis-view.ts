import { AudioReflectable, AudioReflectableRegistry, WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { MusicStructureElements } from "../piano-roll";

export class AnalysisView 
  implements AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: (AudioReflectable & WindowReflectable)[];
  constructor(
    analysis: MusicStructureElements,
    publishers: [
      WindowReflectableRegistry,
      AudioReflectableRegistry,
    ]
  ) {
    const e = analysis;
    this.children = [e.beat, e.chord, e.melody];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // this.svg.appendChild(beat.beat_bars.svg);
    this.svg.appendChild(e.chord.chord_notes.svg);
    this.svg.appendChild(e.chord.chord_names.svg);
    this.svg.appendChild(e.chord.chord_romans.svg);
    this.svg.appendChild(e.chord.chord_keys.svg);
    this.svg.appendChild(e.melody.d_melody_collection.svg);
    this.svg.appendChild(e.melody.melody_hierarchy.svg);
    this.svg.appendChild(e.melody.ir_hierarchy.svg);
    this.svg.appendChild(e.melody.chord_gravities.svg);
    this.svg.appendChild(e.melody.scale_gravities.svg);
    this.svg.appendChild(e.melody.time_span_tree.svg);
    publishers.forEach(e => e.register(this));
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}