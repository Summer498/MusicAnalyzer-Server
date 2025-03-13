import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { MusicStructureElements } from "../piano-roll";
import { AnalysisView } from "./setup-analysis";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

export const setupPianoRoll = (
  FULL_VIEW: boolean,
  analysis_elements: MusicStructureElements,
  subscribers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
  }
) => {
  const octave_bgs = new OctaveBGs();
  const octave_keys = new OctaveKeys();
  const current_time = new CurrentTimeLine();

  const analysis_view = new AnalysisView(analysis_elements);

  const piano_roll_view = new PianoRoll();
  subscribers.audio.register(analysis_view);
  subscribers.window.register(octave_bgs);
  subscribers.window.register(octave_keys);
  subscribers.window.register(current_time);
  subscribers.window.register(analysis_view);
  subscribers.window.register(piano_roll_view);

  piano_roll_view.svg.appendChild(octave_bgs.svg);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys.svg);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(current_time.svg);
  }
  return piano_roll_view;
};
