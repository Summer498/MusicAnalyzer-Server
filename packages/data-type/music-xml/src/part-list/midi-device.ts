import { HasID } from "../part";

export interface MidiDevice 
  extends HasID {
  readonly port: number
}