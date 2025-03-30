import { HTMLsContainer } from "@music-analyzer/music-analyzer-application";
import { setupApplication } from "@music-analyzer/music-analyzer-application";
import { URLsContainer } from "@music-analyzer/music-analyzer-application";

declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const title: HTMLHeadingElement;
const main = () => {
  const html = new HTMLsContainer(
    audio_player,
    title,
    piano_roll_place,
  )
  const url = new URLsContainer(
    `/MusicAnalyzer-server/resources`,
    `/MusicAnalyzer-server/resources/Hierarchical Analysis Sample/sample1.mp4`,
    new URLSearchParams(window.location.search),
  )
  setupApplication(window, html, url)
};
main();