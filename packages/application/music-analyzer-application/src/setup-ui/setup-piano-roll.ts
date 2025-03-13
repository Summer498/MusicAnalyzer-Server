import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { MusicStructureElements } from "../piano-roll";
import { AnalysisView } from "./setup-analysis";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

export const setupPianoRoll = (
  analysis_elements: MusicStructureElements,
  FULL_VIEW: boolean,
  audio_subscriber: AudioReflectableRegistry,
  window_subscriber: WindowReflectableRegistry,
) => {
  const octave_bgs = new OctaveBGs();
  const octave_keys = new OctaveKeys();
  const current_time = new CurrentTimeLine();

  const analysis_view = new AnalysisView(analysis_elements);

  const piano_roll_view = new PianoRoll();
  audio_subscriber.register(analysis_view);
  window_subscriber.register(octave_bgs);
  window_subscriber.register(octave_keys);
  window_subscriber.register(current_time);
  window_subscriber.register(analysis_view);
  window_subscriber.register(piano_roll_view);

  piano_roll_view.svg.appendChild(octave_bgs.svg);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys.svg);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(current_time.svg);
  }
  return piano_roll_view;
};
