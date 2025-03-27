import { URLsContainer } from "../containers/URLs-container";

const registerSong = (urls: string[], default_url: string, audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const url = urls.pop();
  if (!url) {
    audio_player.src = default_url
    return;
  }

  audio_player.muted = false;
  audio_player.src = url;
  audio_player.onerror = () => {
    audio_player.muted = true;
    registerSong(urls, default_url, audio_player);
  };
};

export const setAudioPlayer = (url: URLsContainer, audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const filename = `${url.resources}/${url.title.id}/${url.title.id}`;
  const extensions = ["mp3", "mp4", "wav", "m4a"];
  registerSong(extensions.map(e => `${filename}.${e}`), url.audio_src, audio_player);
};