import { HasID } from "../part/has-id"
import { MidiDevice } from "./midi-device"
import { MidiInstrument } from "./midi-instrument"
import { ScoreInstrument } from "./score-instrument"

export interface ScorePart 
extends HasID {
  readonly "part-name": string
  readonly "part-abbreviation": string
  readonly "score-instrument": ScoreInstrument
  readonly "midi-device": MidiDevice
  readonly "midi-instrument": MidiInstrument
}