import { CurrentTimeLine, OctaveBGs, OctaveKeys, PianoRoll } from "@music-analyzer/svg-objects";
import { MusicStructureElements } from "../piano-roll";
import { AnalysisView } from "./setup-analysis";
import { ApplicationManager } from "../application-manager";

const setupPianoRoll = (
  FULL_VIEW: boolean,
  analysis_elements: MusicStructureElements,
  manager: ApplicationManager
) => {
  return new PianoRoll(
    manager.window_size_mediator, [
    new OctaveBGs(manager.window_size_mediator).svg,
    new AnalysisView(analysis_elements, [manager.window_size_mediator, manager.audio_time_mediator]).svg,
    new OctaveKeys(manager.window_size_mediator).svg,
    new CurrentTimeLine(!FULL_VIEW, manager.window_size_mediator).svg,
  ]);
};
