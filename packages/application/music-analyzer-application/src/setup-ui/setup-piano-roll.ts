import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { MusicStructureElements } from "../piano-roll";
import { AnalysisView } from "./setup-analysis";
import { ApplicationManager } from "../application-manager";

export const setupPianoRoll = (
  FULL_VIEW: boolean,
  analysis_elements: MusicStructureElements,
  manager: ApplicationManager
) => {
  const octave_bgs = new OctaveBGs();
  const analysis_view = new AnalysisView(analysis_elements);
  const octave_keys = new OctaveKeys();
  const current_time = new CurrentTimeLine();
  const piano_roll_view = new PianoRoll();

  manager.window_subscriber.register(octave_bgs);
  manager.audio_subscriber.register(analysis_view);
  manager.window_subscriber.register(analysis_view);
  manager.window_subscriber.register(octave_keys);
  manager.window_subscriber.register(current_time);
  manager.window_subscriber.register(piano_roll_view);

  piano_roll_view.svg.appendChild(octave_bgs.svg);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys.svg);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(current_time.svg);
  }
  return piano_roll_view;
};
