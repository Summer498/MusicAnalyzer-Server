import { HasID } from "../part/has-id";

export interface ScoreInstrument 
extends HasID {
  readonly "instrument-name": string
}