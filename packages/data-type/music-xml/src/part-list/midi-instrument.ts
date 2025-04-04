import { HasID } from "../part";

export interface MidiInstrument 
  extends HasID {
  readonly "midi-channel": number,
  readonly "midi-program": number,
  readonly volume: number,
  readonly pan: number
}
