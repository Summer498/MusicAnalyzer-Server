import { Support } from "./support"

export type Encoding = {
  readonly software: string
  readonly "encoding-date": string
  readonly supports: Support[]
}