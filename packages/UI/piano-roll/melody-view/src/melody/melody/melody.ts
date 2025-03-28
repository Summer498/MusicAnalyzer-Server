import { ColorChangeSubscriber } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/color-change-subscriber";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-toggle/melody-beep-switcher-subscriber";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-volume/melody-beep-volume-subscriber";
import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { MVVM_ViewModel } from "@music-analyzer/view/src/mvvm/mvvm";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { RequiredByMelodyView } from "./melody-view";
import { MelodyBeep } from "./melody-beep";
import { RequiredByMelodyBeep } from "./melody-beep";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface RequiredByMelody
  extends RequiredByMelodyBeep, RequiredByMelodyView {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController
}

export class Melody
  extends MVVM_ViewModel<MelodyModel, MelodyView>
  implements
  ColorChangeSubscriber,
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  TimeRangeSubscriber {
  #beeper: MelodyBeep
  constructor(
    melody: TimeAndAnalyzedMelody,
  ) {
    const model = new MelodyModel(melody);
    super(model, new MelodyView(model));
    this.#beeper = new MelodyBeep(model);
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(isNaN(this.model.note) ? -99 : -convertToCoordinate(transposed(this.model.note))) }
  updateWidth() { this.view.updateWidth(31 / 32 * scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
  readonly setColor: SetColor = f => this.view.setColor(f)
  onTimeRangeChanged = this.onWindowResized;
  beep() { this.#beeper.beepMelody(); }
  onMelodyBeepCheckChanged(e: boolean) { this.#beeper.onMelodyBeepCheckChanged(e); }
  onMelodyVolumeBarChanged(e: number) { this.#beeper.onMelodyVolumeBarChanged(e); }
}

