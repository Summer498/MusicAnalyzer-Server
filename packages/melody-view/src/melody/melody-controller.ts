import { HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume } from "@music-analyzer/controllers";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { AccompanyToAudio } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";

export class MelodyController implements AccompanyToAudio {
  readonly model: MelodyModel;
  readonly view: MelodyView;
  readonly hierarchy_level: HierarchyLevel;
  readonly melody_beep_switcher: MelodyBeepSwitcher;
  readonly melody_beep_volume: MelodyBeepVolume;

  constructor(
    model: MelodyModel,
    hierarchy_level: HierarchyLevel,
    melody_beep_switcher: MelodyBeepSwitcher,
    melody_beep_volume: MelodyBeepVolume,
  ) {
    this.model = model;
    this.view = new MelodyView(this.model);
    this.hierarchy_level = hierarchy_level;
    this.melody_beep_switcher = melody_beep_switcher;
    this.melody_beep_volume = melody_beep_volume;
    this.onAudioUpdate();
  }
  updateVisibility() {
    this.view.updateVisibility(Number(this.hierarchy_level.range.value));
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
    this.view.onAudioUpdate();
    if (this.melody_beep_switcher.checkbox.checked && this.view.visibility === "visible") {
      this.beepMelody();
    }
  }
}

