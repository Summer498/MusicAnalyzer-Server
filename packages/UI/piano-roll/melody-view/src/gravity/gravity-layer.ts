import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { Gravity } from "./gravity/gravity";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface IGravityLayer
  extends
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable { }

export class GravityLayer
  extends CollectionLayer<Gravity>
  implements IGravityLayer {
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
