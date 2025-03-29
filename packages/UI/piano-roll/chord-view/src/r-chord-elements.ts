import { RequiredByChordKeySeries } from "./r-chord-key-series";
import { RequiredByChordNameSeries } from "./r-chord-name-series";
import { RequiredByChordNotesSeries } from "./r-chord-note-series";
import { RequiredByChordRomanSeries } from "./r-chord-roman-series";

export interface RequiredByChordElements
  extends
  RequiredByChordKeySeries,
  RequiredByChordNameSeries,
  RequiredByChordNotesSeries,
  RequiredByChordRomanSeries { }
