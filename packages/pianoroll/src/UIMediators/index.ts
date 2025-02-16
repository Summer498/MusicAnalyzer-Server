import { AccompanyToAudioRegistry, SvgCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, TimeRangeSlider } from "@music-analyzer/controllers";
import { ChordGravityHierarchy, IRPlotHierarchy, IRSymbolHierarchy, MelodyHierarchy, ScaleGravityHierarchy, TSRHierarchy } from "@music-analyzer/melody-view";

export class DMelodySwitcherMediator {
  private readonly d_melody_switcher: DMelodySwitcher;
  private readonly d_melody_collection: SvgCollection;
  constructor(
    d_melody_switcher: DMelodySwitcher,
    d_melody_collection: SvgCollection
  ) {
    this.d_melody_switcher = d_melody_switcher;
    this.d_melody_collection = d_melody_collection;
    this.init(d_melody_switcher);
  }

  update() {
    const visibility = this.d_melody_switcher.checkbox.checked ? "visible" : "hidden";
    this.d_melody_collection.svg.style.visibility = visibility;
  }
  init(d_melody_switcher: DMelodySwitcher) {
    d_melody_switcher.checkbox.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

export class ScaleGravitySwitcherMediator {
  private readonly scale_gravity_switcher: GravitySwitcher;
  private readonly scale_gravities: ScaleGravityHierarchy;
  constructor(
    scale_gravity_switcher: GravitySwitcher,
    scale_gravities: ScaleGravityHierarchy
  ) {
    this.scale_gravity_switcher = scale_gravity_switcher;
    this.scale_gravities = scale_gravities;
    this.init(scale_gravity_switcher);
  }

  update() {
    const visibility = this.scale_gravity_switcher.checkbox.checked ? "visible" : "hidden";
    this.scale_gravities.svg.style.visibility = visibility;
  }
  init(scale_gravity_switcher: GravitySwitcher) {
    scale_gravity_switcher.checkbox.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

export class ChordGravitySwitcherMediator {
  private readonly chord_gravity_switcher: GravitySwitcher;
  private readonly chord_gravities: ChordGravityHierarchy;
  constructor(
    chord_gravity_switcher: GravitySwitcher,
    chord_gravities: ChordGravityHierarchy
  ) {
    this.chord_gravity_switcher = chord_gravity_switcher;
    this.chord_gravities = chord_gravities;
    this.init(chord_gravity_switcher);
  }

  update() {
    const visibility = this.chord_gravity_switcher.checkbox.checked ? "visible" : "hidden";
    this.chord_gravities.svg.style.visibility = visibility;
  }
  init(chord_gravity_switcher: GravitySwitcher) {
    chord_gravity_switcher.checkbox.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

export class HierarchyLevelSliderMediator {
  private readonly hierarchy_level: HierarchyLevel;
  private readonly melody_hierarchy: MelodyHierarchy;
  private readonly ir_hierarchy: IRSymbolHierarchy;
  private readonly ir_plot: IRPlotHierarchy;
  private readonly time_span_tree: TSRHierarchy;
  private readonly scale_gravities: ScaleGravityHierarchy;
  private readonly chord_gravities: ChordGravityHierarchy;
  constructor(
    hierarchy_level: HierarchyLevel,
    melody_hierarchy: MelodyHierarchy,
    ir_hierarchy: IRSymbolHierarchy,
    ir_plot: IRPlotHierarchy,
    time_span_tree: TSRHierarchy,
    scale_gravities: ScaleGravityHierarchy,
    chord_gravities: ChordGravityHierarchy,
  ) {
    this.hierarchy_level = hierarchy_level;
    this.melody_hierarchy = melody_hierarchy;
    this.ir_hierarchy = ir_hierarchy;
    this.ir_plot = ir_plot;
    this.time_span_tree = time_span_tree;
    this.scale_gravities = scale_gravities;
    this.chord_gravities = chord_gravities;
    this.init(hierarchy_level);
  }

  update() {
    const value = Number(this.hierarchy_level.range.value);
    this.melody_hierarchy.onChangedLayer(value);
    this.ir_hierarchy.onChangedLayer(value);
    this.ir_plot.onChangedLayer(value);
    this.time_span_tree.onChangedLayer(value);
    this.scale_gravities.onChangedLayer(value);
    this.chord_gravities.onChangedLayer(value);
  }
  init(hierarchy_level: HierarchyLevel) {
    hierarchy_level.setHierarchyLevelSliderValues(this.melody_hierarchy.children.length - 1);
    hierarchy_level.range.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

export class MelodyBeepSwitcherMediator {
  private readonly melody_beep_switcher: MelodyBeepSwitcher;
  private readonly melody_hierarchy: MelodyHierarchy;
  constructor(
    melody_beep_switcher: MelodyBeepSwitcher,
    melody_hierarchy: MelodyHierarchy,
  ) {
    this.melody_beep_switcher = melody_beep_switcher;
    this.melody_hierarchy = melody_hierarchy;
    this.init(melody_beep_switcher);
  }

  update() {
    const is_beep = this.melody_beep_switcher.checkbox.checked;
    this.melody_hierarchy.onMelodyBeepCheckChanged(is_beep);
  };
  init(melody_beep_switcher: MelodyBeepSwitcher) {
    melody_beep_switcher.checkbox.checked = true;
    melody_beep_switcher.checkbox.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

export class MelodyBeepVolumeMediator {
  private readonly melody_beep_volume: MelodyBeepVolume;
  private readonly melody_hierarchy: MelodyHierarchy;
  constructor(
    melody_beep_volume: MelodyBeepVolume,
    melody_hierarchy: MelodyHierarchy,
  ) {
    this.melody_beep_volume = melody_beep_volume;
    this.melody_hierarchy = melody_hierarchy;
    this.init(melody_beep_volume);
  }

  update() {
    const value = Number(this.melody_beep_volume.range.value);
    this.melody_hierarchy.onMelodyVolumeBarChanged(value);
  }
  init(melody_beep_volume: MelodyBeepVolume) {
    melody_beep_volume.range.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

export class TimeRangeSliderMediator {
  private readonly time_range_slider: TimeRangeSlider;
  private readonly accompany_to_audio_registry: AccompanyToAudioRegistry;
  constructor(
    time_range_slider: TimeRangeSlider,
    accompany_to_audio_registry: AccompanyToAudioRegistry,
  ) {
    this.time_range_slider = time_range_slider;
    this.accompany_to_audio_registry = accompany_to_audio_registry;
    this.init(time_range_slider);
  }

  update() {
    const time_range = Number(this.time_range_slider.slider.value);
    const time_range_max = Number(this.time_range_slider.slider.max);
    const time_range_ratio = Math.pow(2, time_range - time_range_max);
    this.time_range_slider.span.textContent = `${Math.floor(time_range_ratio * 100)} %`;
    PianoRollRatio.value = time_range_ratio;
    this.accompany_to_audio_registry.onAudioUpdate();
    WindowReflectableRegistry.instance.onWindowResized();
  }
  init(time_range_slider: TimeRangeSlider) {
    time_range_slider.slider.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}
