import { TuneInfo } from "./tune-info";

export class URLsContainer {
  readonly tune_info: TuneInfo;
  constructor(
    readonly resources: `/${string}/${string}`,
    readonly audio_src: `/${string}/${string}.${string}`,
    readonly urlParams: URLSearchParams,
  ) {
    this.tune_info = new TuneInfo(
      urlParams.get("tune") || "",
      urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "",
    )
  }
}