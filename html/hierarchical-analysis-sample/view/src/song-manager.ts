import { BeatInfo } from "@music-analyzer/beat-estimation";
import { getBeatBars } from "@music-analyzer/beat-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "@music-analyzer/chord-view";
import { DMelodySwitcher, GravitySwitcher, HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeSlider } from "@music-analyzer/controllers";
import { HTML, SVG } from "@music-analyzer/html";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getDMelodySVGs, getHierarchicalChordGravitySVGs, getHierarchicalIRSymbolSVGs, getHierarchicalMelodySVGs, getHierarchicalScaleGravitySVGs, getTSR_SVGs } from "@music-analyzer/melody-view";
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

  piano_roll.svg.appendChildren([
    // 奥側
    SVG.g({ name: "octave-BGs" }, undefined, getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg.map(e => e.svg)),

    [
      getBeatBars(song_manager.beat_info, getMelody(song_manager.hierarchical_melody)), // song_manager.beat_bars,
      getChordNotesSVG(song_manager.romans), // song_manager.chord_notes,
      getChordNamesSVG(song_manager.romans), // song_manager.chord_names,
      getChordRomansSVG(song_manager.romans), // song_manager.chord_romans,
      getChordKeysSVG(song_manager.romans),  // song_manager.chord_keys,
      getDMelodySVGs(song_manager.d_melodies, d_melody_switcher), // song_manager.d_melody,
    ].map(e => e.group),
    [
      getHierarchicalMelodySVGs(song_manager.hierarchical_melody, hierarchy_level, melody_beep_switcher, melody_beep_volume), // song_manager.hierarchical_melody,
      getHierarchicalIRSymbolSVGs(song_manager.hierarchical_melody, hierarchy_level), // song_manager.hierarchical_IR,
      getHierarchicalChordGravitySVGs(song_manager.hierarchical_melody, hierarchy_level), // song_manager.hierarchical_chord_gravity,
      getHierarchicalScaleGravitySVGs(song_manager.hierarchical_melody, hierarchy_level), // song_manager.hierarchical_scale_gravity,
      getTSR_SVGs(song_manager.hierarchical_melody, hierarchy_level) // song_manager.tsr_svg
    ].map(e => e.map(e => e.group)),
    SVG.g({ name: "octave-keys" }, undefined, getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg.map(e => e.svg)),
    getCurrentTimeLine().svg,
    // 手前側
  ]);

  piano_roll_place.insertAdjacentElement("beforeend", piano_roll.svg);
};

export const appendController = (piano_roll_place: HTMLDivElement) => {
  piano_roll_place.insertAdjacentElement("beforeend", HTML.div(
    { id: "controllers", style: "margin-top:20px" },
    "",
    [
      HTML.div({ id: "d-melody" }, "", [
        d_melody_switcher.body,
      ]),
      HTML.div({ id: "hierarchy-level" }, "", [
        hierarchy_level.body
      ]),
      HTML.div({ id: "time-length" }, "", [
        time_range_slider.body
      ]),
      HTML.div({ id: "gravity-switcher" }, "", [
        key_gravity_switcher.body,
        chord_gravity_switcher.body,
      ]),
      HTML.div({ id: "melody-beep-controllers" }, "", [
        melody_beep_switcher.body,
        melody_beep_volume.body
      ]),
      // NOTE: 色選択は未実装なので消しておく
      HTML.div({ display: "inline" }, "",
        melody_color_selector.body,
      )
    ]
  ));
};
