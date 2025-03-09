import { HasID } from "../part/has-id";

export interface MidiInstrument extends HasID {
  readonly "midi-channel": number,
  readonly "midi-program": number,
  readonly volume: number,
  readonly pan: number
}
