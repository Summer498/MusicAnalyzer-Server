import { WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { PianoRollController } from "./piano-roll-controller";

export const registerListener = (piano_roll: PianoRollController) => {
  function updateDMelodyVisibility(this: HTMLInputElement) {
    piano_roll.d_melody_controllers.svg.style.visibility = this.checked ? "visible" : "hidden";
  }
  piano_roll.d_melody_switcher.checkbox.addEventListener("input", updateDMelodyVisibility);
  updateDMelodyVisibility.bind(piano_roll.d_melody_switcher.checkbox)();

  function updateKeyGravityVisibility(this: HTMLInputElement) {
    piano_roll.scale_gravities.svg.style.visibility = this.checked ? "visible" : "hidden";
  }
  piano_roll.key_gravity_switcher.checkbox.addEventListener("input", updateKeyGravityVisibility);

  updateKeyGravityVisibility.bind(piano_roll.key_gravity_switcher.checkbox)();

  function updateChordGravityVisibility(this: HTMLInputElement) {
    piano_roll.chord_gravities.svg.style.visibility = this.checked ? "visible" : "hidden";
  }
  piano_roll.chord_gravity_switcher.checkbox.addEventListener("input", updateChordGravityVisibility);
  updateChordGravityVisibility.bind(piano_roll.chord_gravity_switcher.checkbox)();
  

  piano_roll.hierarchy_level.setHierarchyLevelSliderValues(piano_roll.melody_group.children.length - 1);
  function updateHierarchyLevel(this: HTMLInputElement) {
    const value = Number(this.value);
    piano_roll.melody_group.onChangedLayer(value);
    piano_roll.ir_group.onChangedLayer(value);
    piano_roll.ir_plot.onChangedLayer(value);
    piano_roll.time_span_tree.onChangedLayer(value);
    piano_roll.scale_gravities.onChangedLayer(value);
    piano_roll.chord_gravities.onChangedLayer(value);
  }
  piano_roll.hierarchy_level.range.addEventListener("input", updateHierarchyLevel);
  updateHierarchyLevel.bind(piano_roll.hierarchy_level.range)();

  function updateMelodyBeep(this: HTMLInputElement) {
    piano_roll.melody_group.onMelodyBeepCheckChanged(this.checked);
  };
  piano_roll.melody_beep_switcher.checkbox.checked = true;
  piano_roll.melody_beep_switcher.checkbox.addEventListener("input", updateMelodyBeep);
  updateMelodyBeep.bind(piano_roll.melody_beep_switcher.checkbox)();

  function updateMelodyBeepVolume(this: HTMLInputElement) {
    piano_roll.melody_group.onMelodyVolumeBarChanged(Number(this.value));
  }
  piano_roll.melody_beep_volume.range.addEventListener("input", updateMelodyBeepVolume);
  updateMelodyBeepVolume.bind(piano_roll.melody_beep_volume.range)();

  function updateTimeRange(this: HTMLInputElement) {
    piano_roll.time_range_slider.span.textContent = `${Math.floor(Math.pow(2, Number(this.value) - Number(this.max)) * 100)} %`;
    PianoRollRatio.value = Math.pow(2, Number(this.value) - Number(this.max));
    piano_roll.accompany_to_audio_registry.onAudioUpdate();
    WindowReflectableRegistry.instance.onWindowResized();
  }
  piano_roll.time_range_slider.slider.addEventListener("input", updateTimeRange);
  updateTimeRange.bind(piano_roll.time_range_slider.slider)();
};