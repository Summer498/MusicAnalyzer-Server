(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly song_name="$1"

  readonly pyin_src="./resources/$song_name/demucs/vocals.wav"
  readonly img_src="./resources/$song_name/analyzed/melody/pyin/vocals.f0.json"
  readonly img_dst="./resources/$song_name/analyzed/melody/pyin/vocals.f0.png"
  python -m pyin2img "$img_src" --audio_file "$pyin_src" -o "$img_dst"
)
