import { _Scale } from "@music-analyzer/tonal-objects";
import { MVCController } from "@music-analyzer/view";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-veiw";

export class ChordKeyController extends MVCController {
  readonly model: ChordKeyModel;
  readonly view: ChordKeyView;
  constructor(model: ChordKeyModel) {
    super();
    this.model = model;
    this.view = new ChordKeyView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
}
