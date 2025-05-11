import { RequiredByChordKeySeries } from "./key/r-chord-key-series";
import { RequiredByChordNameSeries } from "./name/r-chord-name-series";
import { RequiredByChordNotesSeries } from "./note/r-chord-note-series";
import { RequiredByChordRomanSeries } from "./roman/r-chord-roman-series";

export interface RequiredByChordElements
  extends
  RequiredByChordKeySeries,
  RequiredByChordNameSeries,
  RequiredByChordNotesSeries,
  RequiredByChordRomanSeries { }
