import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityLayer } from "./gravity-layer";
import { RequiredByGravityHierarchy } from "../requirement";
import { IGravityHierarchy } from "../interface";
import { CollectionHierarchy } from "@music-analyzer/view";

export class GravityHierarchy
  extends CollectionHierarchy<GravityLayer>
  implements IGravityHierarchy {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    hierarchical_melodies: SerializedTimeAndAnalyzedMelody[][],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(mode, hierarchical_melodies.map((e, l) => new GravityLayer(mode, e, l)));
    controllers.switcher.register(this);
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
