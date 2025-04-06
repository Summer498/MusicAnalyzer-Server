import { RequiredByMelodyView } from "../r-view/required-by-melody-view";
import { RequiredByMelodyBeep } from "./required-by-beep";
import { RequiredByPart } from "./required-by-abstract-part";

export interface RequiredByMelody
  extends
  RequiredByMelodyBeep,
  RequiredByMelodyView,
  RequiredByPart { }