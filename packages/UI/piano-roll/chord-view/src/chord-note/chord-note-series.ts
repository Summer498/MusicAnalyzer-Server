import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { ChordNotes } from "./chord-notes";
import { RequiredByChordNotesSeries } from "../requirement/note/chord-note-series";

export interface IChordNotesSeries
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }

export class ChordNotesSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordNotes>
  implements IChordNotesSeries {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", romans.map(roman => new ChordNotes(roman)));
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
