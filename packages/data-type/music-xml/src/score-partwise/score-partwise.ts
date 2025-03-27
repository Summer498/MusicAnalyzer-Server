import { Credit } from "../credit/credit"
import { Defaults } from "../defaults/defaults"
import { Identification } from "../identification/identification"
import { Part } from "../part/part"
import { PartList } from "../part-list/part-list"
import { Work } from "./work"

export type ScorePartwise = {
  readonly version: number
  readonly work: Work
  readonly part: Part
  readonly identification: Identification
  readonly defaults: Defaults
  readonly credit: Credit
  readonly "part-list": PartList
}