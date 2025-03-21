import { Beam, Pitch } from "../part"

export type Note = {
  readonly "default-x": number
  readonly "default-y": number
  readonly duration: number
  readonly voice: number
  readonly type: string
  readonly accidental?: string
  readonly dot?: string
  readonly stem?: string
  readonly beam?: Beam
  readonly pitch?: Pitch
  readonly rest?: "";
}