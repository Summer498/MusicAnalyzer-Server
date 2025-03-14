import { TitleInfo } from "./tune-info";

export class URLsContainer {
  readonly title: TitleInfo;
  constructor(
    readonly resources: `/${string}/${string}`,
    readonly audio_src: `/${string}/${string}.${string}`,
    readonly urlParams: URLSearchParams,
  ) {
    this.title = new TitleInfo(
      urlParams.get("tune") || "",
      urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "",
    )
  }
}