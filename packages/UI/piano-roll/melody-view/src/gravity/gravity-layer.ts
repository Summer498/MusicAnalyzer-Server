import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, AudioReflectableRegistry, CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { Gravity, RequiredByGravity } from "./gravity";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface RequiredByGravityLayer
  extends RequiredByGravity {
  readonly audio: AudioReflectableRegistry
}

export class GravityLayer
  extends CollectionLayer<Gravity>
  implements
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    const next = melodies.slice(1);
    super(layer, next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new Gravity(e, layer, n, gravity);
    }).filter(e => e !== undefined));
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
