import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { MusicStructureElements } from "../piano-roll";
import { AnalysisView } from "./setup-analysis";
import { ApplicationManager } from "../application-manager";

export const setupPianoRoll = (
  FULL_VIEW: boolean,
  analysis_elements: MusicStructureElements,
  manager: ApplicationManager
) => {
  const octave_bgs = new OctaveBGs(manager.window_subscriber);
  const analysis_view = new AnalysisView(analysis_elements, [manager.window_subscriber, manager.audio_subscriber]);
  const octave_keys = new OctaveKeys(manager.window_subscriber);
  const current_time = new CurrentTimeLine(manager.window_subscriber);
  const piano_roll_view = new PianoRoll(manager.window_subscriber);

  piano_roll_view.svg.appendChild(octave_bgs.svg);
  piano_roll_view.svg.appendChild(analysis_view.svg);
  piano_roll_view.svg.appendChild(octave_keys.svg);
  if (!FULL_VIEW) {
    piano_roll_view.svg.appendChild(current_time.svg);
  }
  return piano_roll_view;
};
