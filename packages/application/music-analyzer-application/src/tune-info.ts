type Mode = "TSR" | "PR" | "";

export class GTTM_Sample {
  constructor(
    readonly id: string,
    readonly mode: Mode,
  ) { }
}