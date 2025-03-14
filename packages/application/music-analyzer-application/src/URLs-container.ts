export class URLsContainer {
  constructor(
    readonly resources: `/${string}/${string}`,
    readonly audio_src: `/${string}/${string}.${string}`,
    readonly urlParams: URLSearchParams,
  ) { }
}