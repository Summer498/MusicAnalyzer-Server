import { Credit } from "../credit"
import { Defaults } from "../defaults"
import { Identification } from "../identification"
import { Part } from "../part"
import { PartList } from "../part-list"
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