import { RequiredByChordKeySeries } from "./key/chord-key-series";
import { RequiredByChordNameSeries } from "./name/chord-name-series";
import { RequiredByChordNotesSeries } from "./note/chord-note-series";
import { RequiredByChordRomanSeries } from "./chord-roman-series";

export interface RequiredByChordElements
  extends
  RequiredByChordKeySeries,
  RequiredByChordNameSeries,
  RequiredByChordNotesSeries,
  RequiredByChordRomanSeries { }
