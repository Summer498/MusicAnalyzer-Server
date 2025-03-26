import { HTMLsContainer } from "../containers";
import { URLsContainer } from "../containers";
import { loadMusicAnalysis } from "../data-loader";
import { setAudioPlayer } from "../data-loader";
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
