import { HasID } from "../part";

export interface ScoreInstrument 
  extends HasID {
  readonly "instrument-name": string
}