export class HTMLsContainer {
  constructor(
    readonly audio_player: HTMLAudioElement | HTMLVideoElement,
    readonly title: HTMLHeadingElement,
    readonly piano_roll_place: HTMLDivElement,
  ) { }
}