import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectableRegistry } from "@music-analyzer/view";
import { Gravity } from "./gravity";

export class GravityLayer 
  extends CollectionLayer<Gravity> {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    const next = melodies.slice(1);
    super(layer, next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new Gravity(e, layer, n, gravity, [controllers[1]]);
    }).filter(e => e !== undefined));
    controllers[0].register(this);
  }
}
