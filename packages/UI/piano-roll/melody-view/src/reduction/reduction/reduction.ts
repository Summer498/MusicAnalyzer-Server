import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "../reduction-view";
import { MelodyColorController } from "@music-analyzer/controllers";

export class Reduction
  extends MVVM_ViewModel<ReductionModel, ReductionView> {
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
    controllers: [MelodyColorController, AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    const model = new ReductionModel(melody, layer);
    super(model, new ReductionView(model, controllers));
  }
  renewStrong(strong: boolean) { this.view.strong = strong; }
}
