import { HasID } from "../part/has-id";

export interface MidiDevice 
extends HasID {
  readonly port: number
}