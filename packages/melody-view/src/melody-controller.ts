import { HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume } from "@music-analyzer/controllers";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { AccompanyToAudio } from "@music-analyzer/view";
import { get_color_of_Narmour_concept, get_color_on_parametric_scale } from "@music-analyzer/irm";
import { fifthChromaToColor } from "@music-analyzer/color";
import { black_key_prm, CurrentTimeX, NoteSize, NowAt, NowAtX, PianoRollBegin, reservation_range } from "@music-analyzer/view-parameters";
import { play } from "@music-analyzer/synth";
import { deleteMelody } from "./melody-editor-function";

export class MelodyController implements AccompanyToAudio {
  readonly model: MelodyModel;
  readonly view: MelodyView;
  readonly hierarchy_level: HierarchyLevel;
  readonly melody_beep_switcher: MelodyBeepSwitcher;
  readonly melody_beep_volume: MelodyBeepVolume;

  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, melody_beep_switcher: MelodyBeepSwitcher, melody_beep_volume: MelodyBeepVolume, layer?: number) {
    this.model = new MelodyModel(melody, layer || 0);
    // this.view = new MelodyView(get_color_on_parametric_scale(melody.melody_analysis.implication_realization));
    this.view = new MelodyView("#0c0");
    // this.view = new MelodyView(get_color_of_Narmour_concept(melody.melody_analysis.implication_realization));
    // this.view = new MelodyView(melody.note ? fifthChromaToColor(melody.note, 0.75, 0.9) : "#000");
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    this.hierarchy_level = hierarchy_level;
    this.melody_beep_switcher = melody_beep_switcher;
    this.melody_beep_volume = melody_beep_volume;
    /*
    CurrentTimeX.onUpdate.push(this.updateX.bind(this));
    NowAt.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateWidth.bind(this));
    */
    this.onAudioUpdate();
  }
  updateX() { this.view.x = CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value; }
  updateY() { this.view.y = this.model.note === undefined ? -99 : (PianoRollBegin.value - this.model.note) * black_key_prm.height; }
  updateWidth() { this.view.width = this.model.end * 15 / 16 * NoteSize.value - this.model.begin * 15 / 16 * NoteSize.value; }
  updateHeight() { this.view.height = black_key_prm.height; }
  updateVisibility() {
    const is_visible = this.hierarchy_level.range.value === `${this.model.layer}`;
    this.view.visibility = is_visible ? "visible" : "hidden";
  }

  beepMelody = () => {
    if (!this.model.note) { return; }
    if (NowAt.value <= this.model.begin && this.model.begin < NowAt.value + reservation_range) {
      if (this.view.sound_reserved === false) {
        const volume = Number(this.melody_beep_volume.range.value) / 400;
        const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
        const begin_sec = this.model.begin - NowAt.value;
        const length_sec = this.model.end - this.model.begin;
        play(pitch, begin_sec, length_sec, volume);
        this.view.sound_reserved = true;
        setTimeout(() => { this.view.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  };

  onAudioUpdate() {
    this.updateVisibility();
    this.view.onclick = deleteMelody;
    this.updateX();
    this.updateWidth();
    if (this.melody_beep_switcher.checkbox.checked && this.view.visibility === "visible") {
      this.beepMelody();
    }
  }
}

