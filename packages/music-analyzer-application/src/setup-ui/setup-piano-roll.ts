import { CurrentTimeLine, PianoRoll } from "@music-analyzer/svg-objects";
import { BeatElements, ChordElements, MelodyElements } from "../piano-roll";
import { OctaveBGs } from "@music-analyzer/svg-objects/src/octave-bg";
import { OctaveKeys } from "@music-analyzer/svg-objects/src/octave-keys";
import { AnalysisView } from "./setup-analysis";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { register } from "module";

export const setupPianoRoll = (
  beat: BeatElements,
  chord: ChordElements,
  melody: MelodyElements,
  FULL_VIEW: boolean
) => {
  const octave_bgs = new OctaveBGs();
  const octave_keys = new OctaveKeys();
  const current_time = new CurrentTimeLine();

  const analysis_view = new AnalysisView(beat, chord, melody);

  const piano_roll_view = new PianoRoll();
  AudioReflectableRegistry.instance.register(analysis_view);
  WindowReflectableRegistry.instance.register(octave_bgs);
  WindowReflectableRegistry.instance.register(octave_keys);
  WindowReflectableRegistry.instance.register(current_time);
  WindowReflectableRegistry.instance.register(analysis_view);
  WindowReflectableRegistry.instance.register(piano_roll_view);

  piano_roll_view.svg.appendChild(octave_bgs.svg);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys.svg);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(current_time.svg);
  }
  return piano_roll_view;
};
