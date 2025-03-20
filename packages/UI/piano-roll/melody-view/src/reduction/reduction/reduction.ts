import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "../reduction-view";
import { ColorChangeSubscriber, hasArchetype, MelodyColorController } from "@music-analyzer/controllers";

export class Reduction
  extends MVVM_ViewModel<ReductionModel, ReductionView>
  implements
  ColorChangeSubscriber {
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
    controllers: [MelodyColorController]
  ) {
    const model = new ReductionModel(melody, layer);
    super(model, new ReductionView(model));
    controllers[0].register(this);
  }
  renewStrong(strong: boolean) { this.view.strong = strong; }
  setColor(getColor: (e: hasArchetype) => string) { this.view.setColor(getColor); }
  updateColor() { this.view.updateColor(); }
  onWindowResized() { this.view.onWindowResized() }
}
