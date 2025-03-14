import { GTTM_Sample } from "./tune-info";

export class URLsContainer {
  readonly gttm_sample: GTTM_Sample;
  constructor(
    readonly resources: `/${string}/${string}`,
    readonly audio_src: `/${string}/${string}.${string}`,
    readonly urlParams: URLSearchParams,
  ) {
    this.gttm_sample = new GTTM_Sample(
      urlParams.get("tune") || "",
      urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "",
    )
  }
}