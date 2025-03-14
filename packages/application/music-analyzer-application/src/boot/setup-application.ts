import { loadMusicAnalysis, setAudioPlayer } from "../data-loader";
import { HTMLsContainer } from "../containers/HTMLs-container";
import { setup } from "./setup";
import { updateTitle } from "./update-title";
import { URLsContainer } from "../containers/URLs-container";

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
