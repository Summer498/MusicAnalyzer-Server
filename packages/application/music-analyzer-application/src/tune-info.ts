type Mode = "TSR" | "PR" | "";

export class TitleInfo {
  constructor(
    readonly id: string,
    readonly mode: Mode,
  ) { }
}