import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityLayer } from "./gravity-layer";
import { GravitySwitcherSubscriber } from "@music-analyzer/controllers";

export class GravityHierarchy extends CollectionHierarchy<GravityLayer> implements GravitySwitcherSubscriber{
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
  ) {
    super(mode, hierarchical_melodies.map((e, l) => new GravityLayer(mode, e, l)));
  }
  onUpdateGravityVisibility (visible: boolean){
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
}
