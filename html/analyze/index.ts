import { setupApplication } from "@music-analyzer/music-analyzer-application";

declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const title: HTMLHeadingElement;
const main = () => {
  const resources = `/MusicAnalyzer-server/resources`;
  const audio_src = `${resources}/Hierarchical Analysis Sample/sample1.mp4`;
  const urlParams = new URLSearchParams(window.location.search);
  setupApplication(window, urlParams, audio_src, audio_player, piano_roll_place, title, resources,)
};
main();