import { RequiredByChordKeySeries } from "./r-series";
import { RequiredByChordNameSeries } from "./r-series";
import { RequiredByChordNotesSeries } from "./r-series";
import { RequiredByChordRomanSeries } from "./r-series";

export interface RequiredByChordElements
  extends
  RequiredByChordKeySeries,
  RequiredByChordNameSeries,
  RequiredByChordNotesSeries,
  RequiredByChordRomanSeries { }
