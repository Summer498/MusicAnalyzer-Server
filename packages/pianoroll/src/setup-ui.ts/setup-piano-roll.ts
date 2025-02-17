import { getBlackBGs, getBlackKeys, getCurrentTimeLine, getOctaveBGs, getOctaveKeys, getWhiteBGs, getWhiteKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { BeatElements, ChordElements, MelodyElements } from "../piano-roll";
import { setupAnalysis } from "./setup-analysis";

export const setupPianoRoll = (
  beat: BeatElements,
  chord: ChordElements,
  melody: MelodyElements,
  FULL_VIEW: boolean
) => {
  const octave_bgs = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_bgs.id = "octave-BGs";
  getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg
    .forEach(e => octave_bgs.appendChild(e.svg));

  const analysis_view = setupAnalysis(beat, chord, melody);
  const octave_keys = document.createElementNS("http://www.w3.org/2000/svg", "g");
  octave_keys.id = "octave-keys";
  getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg
    .forEach(e => octave_keys.appendChild(e.svg));

  const piano_roll_view = new PianoRoll();
  piano_roll_view.svg.appendChild(octave_bgs);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(getCurrentTimeLine().svg);
  }
  return piano_roll_view;
};
