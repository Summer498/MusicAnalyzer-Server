import { _Scale } from "@music-analyzer/tonal-objects";
import { Controller } from "@music-analyzer/view";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-veiw";

export class ChordKeyController implements Controller {
  readonly model: ChordKeyModel;
  readonly view: ChordKeyView;
  constructor(model: ChordKeyModel) {
    this.model = model;
    this.view = new ChordKeyView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
}
