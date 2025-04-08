import { RequiredByMelodyBeep } from "./required-by-beep";
import { RequiredByPart } from "../abstract/required-by-abstract-part";
import { RequiredByMelodyView } from "./required-by-melody-view";

export interface RequiredByMelody
  extends
  RequiredByMelodyBeep,
  RequiredByMelodyView,
  RequiredByPart { }