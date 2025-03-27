import { HTMLsContainer } from "../containers/HTMLs-container";
import { URLsContainer } from "../containers/URLs-container";
import { loadMusicAnalysis } from "../data-loader/MusicAnalysisLoader";
import { setAudioPlayer } from "../data-loader/set-audio-player";
import { setup } from "./setup";
import { updateTitle } from "./update-title";

export const setupApplication = (
  window: Window,
  html: HTMLsContainer,
  url: URLsContainer,
) => {
  updateTitle(html.title, url.title);
  setAudioPlayer(url, html.audio_player);
  loadMusicAnalysis(url)
    .then(setup(window, html, url.title));
}
