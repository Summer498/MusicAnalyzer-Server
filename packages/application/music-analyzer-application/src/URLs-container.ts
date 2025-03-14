type Mode = "TSR" | "PR" | "";
export class URLsContainer {
  readonly tune_info: {
    readonly tune_id: string;
    readonly mode: Mode;
  }
  constructor(
    readonly resources: `/${string}/${string}`,
    readonly audio_src: `/${string}/${string}.${string}`,
    readonly urlParams: URLSearchParams,
  ) {
    this.tune_info = {
      tune_id: urlParams.get("tune") || "",
      mode: urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "",
    }
  }
}