import { CreditWords } from "./credit-words"

export type Credit = {
  readonly page: number
  readonly "credit-type": string
  readonly "credit-words": CreditWords
}