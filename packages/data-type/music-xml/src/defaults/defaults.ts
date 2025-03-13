import { Font } from "./font"
import { PageLayout } from "./page-layout"
import { Scaling } from "./scaling"

export type Defaults = {
  readonly scaling: Scaling
  readonly "page-layout": PageLayout
  readonly "word-font": Font
  readonly "lyric-font": Font
}