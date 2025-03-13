import { MVVM_ViewModel } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";
import { Gravity, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";


export class GravityVM extends MVVM_ViewModel<GravityModel, GravityView> {
  constructor(
    e: TimeAndAnalyzedMelody,
    layer: number,
    readonly next: TimeAndAnalyzedMelody,
    readonly gravity: Gravity,
  ) {
    const model = new GravityModel(e, layer, next, gravity);
    super(model, new GravityView(model));
  }
}
