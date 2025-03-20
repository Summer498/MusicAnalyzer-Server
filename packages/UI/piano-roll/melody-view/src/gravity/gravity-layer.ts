import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer } from "@music-analyzer/view";
import { Gravity } from "./gravity";
import { RequiredByGravity } from "./gravity/gravity";

export interface RequiredByGravityLayer
  extends RequiredByGravity {
  readonly audio: AudioReflectableRegistry
}

export class GravityLayer
  extends CollectionLayer<Gravity> {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: RequiredByGravityLayer,
  ) {
    const next = melodies.slice(1);
    super(layer, next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new Gravity(e, layer, n, gravity, controllers);
    }).filter(e => e !== undefined));
    controllers.audio.register(this);
  }
}
