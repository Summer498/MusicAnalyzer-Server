import { BeatInfo } from "@music-analyzer/beat-estimation";
import { getBeatBars } from "@music-analyzer/beat-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "@music-analyzer/chord-view";
import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeSlider } from "@music-analyzer/controllers";
import { HTML, SVG } from "@music-analyzer/html";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getDMelodyControllers, getHierarchicalChordGravitySVGs, getHierarchicalIRSymbolSVGs, getHierarchicalMelodySVGs, getHierarchicalScaleGravitySVGs, getTSR_SVGs } from "@music-analyzer/melody-view";
import { getBlackBGs, getBlackKeys, getCurrentTimeLine, getOctaveBGs, getOctaveKeys, getWhiteBGs, getWhiteKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { Assertion, _throw } from "@music-analyzer/stdlib";
import { PianoRollTimeLength } from "@music-analyzer/view-parameters";


const d_melody_switcher = new DMelodySwitcher();
const hierarchy_level = new HierarchyLevel();
const time_range_slider = new TimeRangeSlider();
const key_gravity_switcher = new GravitySwitcher("key_gravity_switcher", "Key Gravity", []);
const chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity", []);
const melody_beep_switcher = new MelodyBeepSwitcher();
const melody_beep_volume = new MelodyBeepVolume();
const melody_color_selector = new MelodyColorSelector();

export class SongManager {
  beat_info: BeatInfo;
  romans: TimeAndRomanAnalysis[];
  hierarchical_melody: TimeAndMelodyAnalysis[][];
  // melodies: TimeAndMelodyAnalysis[];
  d_melodies: TimeAndMelodyAnalysis[];
  constructor(
    beat_info: BeatInfo,
    romans: TimeAndRomanAnalysis[],
    hierarchical_melody: TimeAndMelodyAnalysis[][],
    // melodies: TimeAndMelodyAnalysis[],
    d_melodies: TimeAndMelodyAnalysis[]
  ) {
    this.beat_info = beat_info;
    this.romans = romans;
    this.hierarchical_melody = hierarchical_melody;
    // this.melodies = melodies;
    this.d_melodies = d_melodies;
  }
}

const getMelody = (hierarchical_melody: TimeAndMelodyAnalysis[][]) => hierarchical_melody[hierarchical_melody.length - 1];

export const appendPianoRoll = (piano_roll_place: HTMLDivElement, song_manager: SongManager) => {
  const piano_roll = new PianoRoll();

  new Assertion(song_manager.hierarchical_melody.length > 0).onFailed(() => { throw new Error(`hierarchical melody length must be more than 0 but it is ${song_manager.hierarchical_melody.length}`); });
  const melodies = song_manager.hierarchical_melody[song_manager.hierarchical_melody.length - 1];
  PianoRollTimeLength.setSongLength(
    Math.max(
      ...song_manager.romans.map(e => e.end),
      ...melodies.map(e => e.end)
    ));

  console.log(`song_manager.hierarchical_melody.length: ${song_manager.hierarchical_melody.length}`);
  hierarchy_level.setHierarchyLevelSliderValues(song_manager.hierarchical_melody.length - 1);

  // 奥側
  const octave_bgs = SVG.g();
  octave_bgs.setAttribute("name", "octave-BGs");
  getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg
    .forEach(e => octave_bgs.appendChild(e.svg));

  piano_roll.svg.appendChild(octave_bgs);
  piano_roll.svg.appendChild(getBeatBars(song_manager.beat_info, getMelody(song_manager.hierarchical_melody)).group);
  piano_roll.svg.appendChild(getChordNotesSVG(song_manager.romans).group);
  piano_roll.svg.appendChild(getChordNamesSVG(song_manager.romans).group);
  piano_roll.svg.appendChild(getChordRomansSVG(song_manager.romans).group);
  piano_roll.svg.appendChild(getChordKeysSVG(song_manager.romans).group);
  piano_roll.svg.appendChild(getDMelodyControllers(song_manager.d_melodies, d_melody_switcher).group);
  getHierarchicalMelodySVGs(song_manager.hierarchical_melody, hierarchy_level, melody_beep_switcher, melody_beep_volume)
    .forEach(e => piano_roll.svg.appendChild(e.group));
  getHierarchicalIRSymbolSVGs(song_manager.hierarchical_melody, hierarchy_level)
    .forEach(e => piano_roll.svg.appendChild(e.group));
  getHierarchicalChordGravitySVGs(song_manager.hierarchical_melody, hierarchy_level)
    .forEach(e => piano_roll.svg.appendChild(e.group));
  getHierarchicalScaleGravitySVGs(song_manager.hierarchical_melody, hierarchy_level)
    .forEach(e => piano_roll.svg.appendChild(e.group));
  getTSR_SVGs(song_manager.hierarchical_melody, hierarchy_level)
    .forEach(e => piano_roll.svg.appendChild(e.group));
  const octave_keys = SVG.g();
  octave_keys.setAttribute("name", "octave-keys");
  getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg
    .forEach(e => octave_keys.appendChild(e.svg));
  piano_roll.svg.appendChild(octave_keys);
  piano_roll.svg.appendChild(getCurrentTimeLine().svg);
  // 手前側

  piano_roll_place.insertAdjacentElement("beforeend", piano_roll.svg);
};

export const appendController = (piano_roll_place: HTMLDivElement) => {
  const d_melody_div = HTML.div();
  d_melody_div.setAttribute("id", "d-melody");
  d_melody_div.appendChild(d_melody_switcher.body);
  const hierarchy_level_div = HTML.div();
  hierarchy_level_div.setAttribute("id", "hierarchy-level");
  hierarchy_level_div.appendChild(hierarchy_level.body);
  const time_length_div = HTML.div();
  time_length_div.setAttribute("id", "time-length");
  time_length_div.appendChild(time_range_slider.body);
  const gravity_switcher_div = HTML.div();
  gravity_switcher_div.setAttribute("id", "gravity-switcher");
  gravity_switcher_div.appendChild(key_gravity_switcher.body);
  gravity_switcher_div.appendChild(chord_gravity_switcher.body);
  const melody_beep_controllers_div = HTML.div();
  melody_beep_controllers_div.appendChild(melody_beep_switcher.body,);
  melody_beep_controllers_div.appendChild(melody_beep_volume.body);
  melody_beep_controllers_div.setAttribute("id", "melody-beep-controllers");
  const melody_color_selector_div = HTML.div();
  melody_color_selector_div.setAttribute("id", "melody-color-selector");
  melody_color_selector_div.setAttribute("display", "inline");  // NOTE: 色選択は未実装なので消しておく
  melody_color_selector_div.appendChild(melody_color_selector.body);
  const controllers = HTML.div();
  controllers.setAttribute("id", "controllers");
  controllers.setAttribute("style", "margin-top:20px");
  controllers.appendChild(d_melody_div);
  controllers.appendChild(hierarchy_level_div);
  controllers.appendChild(time_length_div);
  controllers.appendChild(gravity_switcher_div);
  controllers.appendChild(melody_beep_controllers_div);
  controllers.appendChild(melody_color_selector_div);
  piano_roll_place.insertAdjacentElement("beforeend", controllers);
};
