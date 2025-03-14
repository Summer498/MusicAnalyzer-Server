type Mode = "TSR" | "PR" | "";

export class TuneInfo {
  constructor(
    readonly tune_id: string,
    readonly mode: Mode,
  ) { }
}