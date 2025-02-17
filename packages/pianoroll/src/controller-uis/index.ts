import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeSlider } from "@music-analyzer/controllers";

export const dMelody = (d_melody_switcher: DMelodySwitcher) => {
  const d_melody_div = document.createElement("div");
  d_melody_div.id = "d-melody";
  d_melody_div.appendChild(d_melody_switcher.body);
  return d_melody_div;
};

export const hierarchyLevel = (hierarchy_level: HierarchyLevel) => {
  const hierarchy_level_div = document.createElement("div");
  hierarchy_level_div.id = "hierarchy-level";
  hierarchy_level_div.appendChild(hierarchy_level.body);
  return hierarchy_level_div;
};

export const timeLength = (time_range_slider: TimeRangeSlider) => {
  const time_length_div = document.createElement("div");
  time_length_div.id = "time-length";
  time_length_div.appendChild(time_range_slider.body);
  return time_length_div;
};

export const gravitySwitcher = (
  chord_gravity_switcher: GravitySwitcher,
  scale_gravity_switcher: GravitySwitcher,
) => {
  const gravity_switcher_div = document.createElement("div");
  gravity_switcher_div.id = "gravity-switcher";
  gravity_switcher_div.appendChild(scale_gravity_switcher.body);
  gravity_switcher_div.appendChild(chord_gravity_switcher.body);
  return gravity_switcher_div;
};

export const melodyBeepController = (
  melody_beep_switcher: MelodyBeepSwitcher,
  melody_beep_volume: MelodyBeepVolume,
) => {
  const melody_beep_controllers_div = document.createElement("div");
  melody_beep_controllers_div.appendChild(melody_beep_switcher.body,);
  melody_beep_controllers_div.appendChild(melody_beep_volume.body);
  melody_beep_controllers_div.id = "melody-beep-controllers";
  return melody_beep_controllers_div;
};

export const melodyColorSelector = (melody_color_selector: MelodyColorSelector) => {
  const melody_color_selector_div = document.createElement("div");
  melody_color_selector_div.id = "melody-color-selector";
  melody_color_selector_div.style.display = "inline";
  melody_color_selector_div.appendChild(melody_color_selector.body);
  return melody_color_selector_div;
};


export class ControllerUIs {
  readonly scale_gravity_switcher: GravitySwitcher;
  readonly chord_gravity_switcher: GravitySwitcher;
  readonly d_melody_switcher: DMelodySwitcher;
  readonly melody_beep_switcher: MelodyBeepSwitcher;
  readonly melody_beep_volume: MelodyBeepVolume;
  readonly melody_color_selector: MelodyColorSelector;
  readonly hierarchy_level: HierarchyLevel;
  readonly time_range_slider: TimeRangeSlider;

  constructor(){
    this.scale_gravity_switcher = new GravitySwitcher("scale_gravity_switcher", "Scale Gravity");
    this.chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
    this.d_melody_switcher = new DMelodySwitcher("d_melody_switcher", "detected melody before fix");
    this.melody_beep_switcher = new MelodyBeepSwitcher("melody_beep_switcher", "Beep Melody");
    this.melody_beep_volume = new MelodyBeepVolume();
    this.melody_color_selector = new MelodyColorSelector();
    this.hierarchy_level = new HierarchyLevel();
    this.time_range_slider = new TimeRangeSlider();
  }
}
