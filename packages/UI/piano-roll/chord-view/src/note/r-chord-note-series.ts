import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "../r-chord-parts-series";

export interface RequiredByChordNoteModel
  extends RequiredByChordPartModel { }

export interface RequiredByChordPart {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export interface RequiredByChordNote
extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}

export interface RequiredByChordNotesInOctave
  extends RequiredByChordNote { }

export interface RequiredByChordNotes
  extends RequiredByChordNotesInOctave { }

export interface RequiredByChordNotesSeries
  extends RequiredByChordNotes { }
