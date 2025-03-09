import { Time } from "./time"
import { Clef } from "./clef"
import { Key } from "./key"

export type Attribute = {
  readonly divisions: number
  readonly key: Key
  readonly time: Time
  readonly clef: Clef
}