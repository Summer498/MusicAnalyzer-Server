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

export const setAudioPlayer = (resources: string, tune_name: string, default_url:string, audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const filename = `${resources}/${tune_name}/${tune_name}`;
  const extensions = ["mp3", "mp4", "wav", "m4a"];
  registerSong(extensions.map(e => `${filename}.${e}`), default_url, audio_player);
};