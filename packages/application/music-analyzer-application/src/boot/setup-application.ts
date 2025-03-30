import { HTMLsContainer } from "./facade";
import { URLsContainer } from "./facade";
import { loadMusicAnalysis } from "./facade";
import { setAudioPlayer } from "./facade";
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
